"""Substitua tudo aqui pela sua implementação."""

from dataclasses import dataclass


@dataclass
class User:
    id: str


@dataclass
class Registration:
    id: str
    cpf: str


async def authenticate() -> User:
    """Dependência simulada. Troque pela sua sessão real."""
    return User(id="user-1")


class _Db:
    async def registration_by_user(self, _user_id: str) -> Registration:
        return Registration(id="pedido-4471", cpf="000.000.000-00")

    async def link(self, _registration_id: str, _verification_public_id: str) -> None: ...

    async def record_if_new(self, _delivery_id: str) -> bool:
        """Deduplica pelo header X-Legitimuz-Delivery."""
        return True


class _Queue:
    async def publish(self, _event: dict) -> None: ...


db = _Db()
queue = _Queue()
