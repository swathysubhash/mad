package api

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/swathysubhash/mad/datastore"
	"github.com/swathysubhash/mad/router"
	"log"
	"net/http"
)

var store = datastore.NewDatastore(nil)

func Handler() *mux.Router {
	m := router.Api()

	m.Get("create:api").Handler(handler(createApi))
	m.Get("getall:api").Handler(handler(getAllApi))
	m.Get("getall:api:createdby").Handler(handler(getAllApiByMe))
	m.Get("get:api").Handler(handler(getApi))
	m.Get("update:api").Handler(handler(updateApi))
	m.Get("publish:api").Handler(handler(publishApi))
	m.Get("delete:api").Handler(handler(deleteApi))
	m.Get("summary:api").Handler(handler(summaryApi))
	m.Get("get:api:style").Handler(handler(getApiStyle))
	m.Get("update:api:style").Handler(handler(updateApiStyle))

	m.Get("create:group").Handler(handler(createGroup))
	m.Get("get:group:byapi").Handler(handler(getAllGroup))
	m.Get("get:group").Handler(handler(getGroup))
	m.Get("update:group").Handler(handler(updateGroup))
	m.Get("delete:group").Handler(handler(deleteGroup))

	m.Get("create:endpoint").Handler(handler(createEndpoint))
	m.Get("get:endpoint:bygroup").Handler(handler(getAllEndpoint))
	m.Get("get:endpoint").Handler(handler(getEndpoint))
	m.Get("update:endpoint").Handler(handler(updateEndpoint))
	m.Get("delete:endpoint").Handler(handler(deleteEndpoint))

	m.Get("create:access").Handler(handler(createAccess))
	m.Get("get:access:byresource").Handler(handler(getAllAccess))
	m.Get("update:access").Handler(handler(updateAccess))

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
