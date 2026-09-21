import hashlib
import hmac
import json
import os
import time

from fastapi import Request, Response

from main import app
from stubs import db, queue

TOLERANCE_SECONDS = 300


def is_signature_valid(raw_body: bytes, header: str, secret: str) -> bool:
    parts = dict(p.split("=", 1) for p in header.split(",") if "=" in p)
    try:
        timestamp = int(parts["t"])
        received = parts["v1"]
    except (KeyError, ValueError):
        return False

    if abs(int(time.time()) - timestamp) > TOLERANCE_SECONDS:
        return False

    expected = hmac.new(
        secret.encode(), f"{timestamp}.".encode() + raw_body, hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, received)


@app.post("/api/webhooks/legitimuz")
async def receive(request: Request):
    # await request.body() devolve os BYTES originais. Um modelo Pydantic aqui já
    # reserializaria o JSON, e a assinatura passaria a falhar sempre.
    raw_body = await request.body()
    header = request.headers.get("x-legitimuz-signature", "")

    if not is_signature_valid(raw_body, header, os.environ["LEGITIMUZ_WEBHOOK_SECRET"]):
        return Response(status_code=401)

    delivery_id = request.headers.get("x-legitimuz-delivery", "")
    if not await db.record_if_new(delivery_id):
        return Response(status_code=200)

    await queue.publish(json.loads(raw_body))

    return Response(status_code=200)
