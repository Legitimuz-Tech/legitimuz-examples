import os

import httpx
from fastapi import Depends, FastAPI, HTTPException

from stubs import autenticar, db

app = FastAPI()
API = "https://api.legitimuz.com/public/verifications"


@app.post("/api/verificacoes")
async def criar_verificacao(usuario=Depends(autenticar)):
    # O documento vem do SEU cadastro, nunca do corpo da requisição.
    cadastro = await db.cadastro_por_usuario(usuario.id)

    async with httpx.AsyncClient(timeout=10) as client:
        resposta = await client.post(
            API,
            headers={
                "X-API-Key": os.environ["LEGITIMUZ_API_KEY"],
                "Content-Type": "application/json",
            },
            json={
                "schema_version": "1.0",
                "ref_id": cadastro.id,
                "document": {"type": "cpf", "number": cadastro.cpf},
                "flow_public_id": os.environ["LEGITIMUZ_FLOW_ID"],
            },
        )

    if resposta.is_error:
        raise HTTPException(status_code=502, detail="legitimuz_indisponivel")

    dados = resposta.json()
    await db.vincular(cadastro.id, dados["verification"]["public_id"])

    # Só a entry volta ao cliente. O resto fica no servidor.
    return {"entry": dados["entry"]}
