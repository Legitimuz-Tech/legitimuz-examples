import os

import httpx
from fastapi import Depends, FastAPI, HTTPException

from stubs import authenticate, db

app = FastAPI()
API = "https://api.legitimuz.com/public/verifications"


@app.post("/api/verifications")
async def create_verification(user=Depends(authenticate)):
    # O documento vem do SEU cadastro, nunca do corpo da requisição.
    registration = await db.registration_by_user(user.id)

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            API,
            headers={
                "X-API-Key": os.environ["LEGITIMUZ_API_KEY"],
                "Content-Type": "application/json",
            },
            json={
                "schema_version": "1.0",
                "ref_id": registration.id,
                "document": {"type": "cpf", "number": registration.cpf},
                "flow_public_id": os.environ["LEGITIMUZ_FLOW_ID"],
            },
        )

    if response.is_error:
        raise HTTPException(status_code=502, detail="legitimuz_unavailable")

    data = response.json()
    await db.link(registration.id, data["verification"]["public_id"])

    # Só a entry volta ao cliente. O resto fica no servidor.
    return {"entry": data["entry"]}
