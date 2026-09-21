package main

import "net/http"

// Substitua tudo neste arquivo pela sua implementação.

type User struct{ ID string }

type Registration struct {
	ID  string
	CPF string
}

func authenticate(_ *http.Request) (User, bool) {
	return User{ID: "user-1"}, true
}

type fakeDB struct{}

func (fakeDB) RegistrationByUser(_ string) Registration {
	return Registration{ID: "pedido-4471", CPF: "000.000.000-00"}
}

func (fakeDB) Link(_, _ string) {}

// RecordIfNew deduplica pelo header X-Legitimuz-Delivery.
func (fakeDB) RecordIfNew(_ string) bool { return true }

type fakeQueue struct{}

func (fakeQueue) Publish(_ []byte) {}

var (
	db    = fakeDB{}
	queue = fakeQueue{}
)
