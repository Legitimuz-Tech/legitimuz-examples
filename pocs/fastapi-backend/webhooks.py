import hashlib
import hmac
import json
import os
import time

from fastapi import Request, Response

from main import app
from stubs import db, fila

TOLERANCIA_SEGUNDOS = 300


def assinatura_valida(corpo_cru: bytes, header: str, segredo: str) -> bool:
    partes = dict(p.split("=", 1) for p in header.split(",") if "=" in p)
    try:
        timestamp = int(partes["t"])
        recebida = partes["v1"]
    except (KeyError, ValueError):
        return False

    if abs(int(time.time()) - timestamp) > TOLERANCIA_SEGUNDOS:
        return False

    esperada = hmac.new(
        segredo.encode(), f"{timestamp}.".encode() + corpo_cru, hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(esperada, recebida)


@app.post("/api/webhooks/legitimuz")
async def receber(request: Request):
    # await request.body() devolve os BYTES originais. Um modelo Pydantic aqui já
    # reserializaria o JSON, e a assinatura passaria a falhar sempre.
    corpo_cru = await request.body()
    header = request.headers.get("x-legitimuz-signature", "")

    if not assinatura_valida(corpo_cru, header, os.environ["LEGITIMUZ_WEBHOOK_SECRET"]):
        return Response(status_code=401)

    entrega = request.headers.get("x-legitimuz-delivery", "")
    if not await db.registrar_se_inedita(entrega):
        return Response(status_code=200)

    await fila.publicar(json.loads(corpo_cru))

    return Response(status_code=200)
