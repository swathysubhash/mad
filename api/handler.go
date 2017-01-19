package api

import (
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"mad/datastore"
	"mad/router"
	"net/http"
)

var store = datastore.NewDatastore(nil)

func Handler() *mux.Router {
	m := router.Api()

	m.Get("create:group").Handler(handler(createGroup))
	m.Get("getall:group").Handler(handler(getAllGroup))
	m.Get("get:group").Handler(handler(getGroup))
	m.Get("update:group").Handler(handler(updateGroup))

	m.Get("create:api").Handler(handler(createApi))
	m.Get("getall:api").Handler(handler(getAllApi))
	m.Get("get:api").Handler(handler(getApi))
	m.Get("update:api").Handler(handler(updateApi))

	m.Get("create:endpoint").Handler(handler(createEndpoint))
	m.Get("getall:endpoint").Handler(handler(getAllEndpoint))
	m.Get("get:endpoint").Handler(handler(getEndpoint))
	m.Get("update:endpoint").Handler(handler(updateEndpoint))

	return m
}

type handler func(http.ResponseWriter, *http.Request) error

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := h(w, r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "error: %s", err)
		log.Println(err)
	}
}
