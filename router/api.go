package router

import (
	"github.com/gorilla/mux"
)

func Api() *mux.Router {
	m := mux.NewRouter()

	m.Path("/apis").Methods("PUT").Name("create:api")
	m.Path("/apis").Methods("GET").Name("getall:api")
	m.Path("/apis/{APIID}").Methods("GET").Name("get:api")
	m.Path("/apis/{APIID}").Methods("POST").Name("update:api")

	m.Path("/apis/{APIID}/r/{REVISION}/groups").Methods("PUT").Name("create:group")
	m.Path("/apis/{APIID}/r/{REVISION}/groups").Methods("GET").Name("getall:group")
	m.Path("/apis/{APIID}/r/{REVISION}/groups/{GROUPID}").Methods("GET").Name("get:group")
	m.Path("/apis/{APIID}/r/{REVISION}/groups/{GROUPID}").Methods("POST").Name("update:group")

	m.Path("/groups/{GROUPID}/r/{REVISION}/endpoints").Methods("PUT").Name("create:endpoint")
	m.Path("/groups/{GROUPID}/r/{REVISION}/endpoints").Methods("GET").Name("getall:endpoint")
	m.Path("/groups/{GROUPID}/r/{REVISION}/endpoints/{ENDPOINTID}").Methods("GET").Name("get:endpoint")
	m.Path("/groups/{GROUPID}/r/{REVISION}/endpoints/{ENDPOINTID}").Methods("POST").Name("update:endpoint")

	// m.Path("/group/all").Methods("GET").Name("get:groupall")
	// m.Path("/group/{GROUPID}/endpoint/all").Methods("GET").Name("get:endpointall")

	// m.Path("/group").Methods("POST").Name("post:group")
	// m.Path("/group/{GROUPID}/endpoint").Methods("POST").Name("post:endpoint")

	return m
}
