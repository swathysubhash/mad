package router

import (
	"github.com/gorilla/mux"
)

func Api() *mux.Router {
	m := mux.NewRouter()

	m.Path("/apis").Methods("PUT").Name("create:api")
	m.Path("/apis").Methods("GET").Name("getall:api")
	m.Path("/apis/createdby/{CREATEDBY}").Methods("GET").Name("getall:api:createdby")
	m.Path("/apis/{APIID}").Methods("GET").Name("get:api")
	m.Path("/apis/{APIID}").Methods("POST").Name("update:api")
	m.Path("/apis/{APIID}/delete").Methods("POST").Name("delete:api")
	m.Path("/apis/{APIID}/style").Methods("GET").Name("get:api:style")
	m.Path("/apis/{APIID}/style").Methods("POST").Name("update:api:style")
	m.Path("/apis/{APIID}/publish").Methods("POST").Name("publish:api")
	m.Path("/apis/{APIID}/summary").Methods("GET").Name("summary:api")

	m.Path("/groups").Methods("PUT").Name("create:group")
	m.Path("/groups/apis/{APIID}/r/{REVISION}").Methods("GET").Name("get:group:byapi")
	m.Path("/groups/{GROUPID}").Methods("GET").Name("get:group")
	m.Path("/groups/{GROUPID}").Methods("POST").Name("update:group")
	m.Path("/groups/{GROUPID}/delete").Methods("POST").Name("delete:group")

	m.Path("/endpoints").Methods("PUT").Name("create:endpoint")
	m.Path("/endpoints/groups/{GROUPID}").Methods("GET").Name("get:endpoint:bygroup")
	m.Path("/endpoints/{ENDPOINTID}").Methods("GET").Name("get:endpoint")
	m.Path("/endpoints/{ENDPOINTID}").Methods("POST").Name("update:endpoint")
	m.Path("/endpoints/{ENDPOINTID}/delete").Methods("POST").Name("delete:endpoint")

	m.Path("/access").Methods("PUT").Name("create:access")
	m.Path("/access/{RESOURCEID}").Methods("GET").Name("get:access:byresource")
	m.Path("/access/{RESOURCEID}").Methods("POST").Name("update:access")

	m.Path("/section").Methods("GET").Name("get:docs:section")
	m.Path("/tryout").Methods("POST").Name("get:docs:tryout")
	m.Path("/{DOCSLUG}").Methods("GET").Name("get:docs")

	// m.Path("/group/all").Methods("GET").Name("get:groupall")
	// m.Path("/group/{GROUPID}/endpoint/all").Methods("GET").Name("get:endpointall")

	// m.Path("/group").Methods("POST").Name("post:group")
	// m.Path("/group/{GROUPID}/endpoint").Methods("POST").Name("post:endpoint")

	return m
}
