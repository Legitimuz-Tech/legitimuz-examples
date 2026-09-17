package main

import "net/http"

// Substitua tudo neste arquivo pela sua implementação.

type Usuario struct{ ID string }

type Cadastro struct {
	ID  string
	CPF string
}

func autenticar(_ *http.Request) (Usuario, bool) {
	return Usuario{ID: "usuario-1"}, true
}

type bancoFicticio struct{}

func (bancoFicticio) CadastroPorUsuario(_ string) Cadastro {
	return Cadastro{ID: "pedido-4471", CPF: "000.000.000-00"}
}

func (bancoFicticio) Vincular(_, _ string) {}

// RegistrarSeInedita deduplica pelo header X-Legitimuz-Delivery.
func (bancoFicticio) RegistrarSeInedita(_ string) bool { return true }

type filaFicticia struct{}

func (filaFicticia) Publicar(_ []byte) {}

var (
	db   = bancoFicticio{}
	fila = filaFicticia{}
)
