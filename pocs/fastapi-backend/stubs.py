"""Substitua tudo aqui pela sua implementação."""

from dataclasses import dataclass


@dataclass
class Usuario:
    id: str


@dataclass
class Cadastro:
    id: str
    cpf: str


async def autenticar() -> Usuario:
    """Dependência simulada. Troque pela sua sessão real."""
    return Usuario(id="usuario-1")


class _Db:
    async def cadastro_por_usuario(self, _usuario_id: str) -> Cadastro:
        return Cadastro(id="pedido-4471", cpf="000.000.000-00")

    async def vincular(self, _cadastro_id: str, _verificacao_public_id: str) -> None: ...

    async def registrar_se_inedita(self, _delivery_id: str) -> bool:
        """Deduplica pelo header X-Legitimuz-Delivery."""
        return True


class _Fila:
    async def publicar(self, _evento: dict) -> None: ...


db = _Db()
fila = _Fila()
