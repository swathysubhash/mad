package docsapp

import (
	"fmt"
	"github.com/gorilla/mux"
	// "html/template"
	"log"
	services "mad/api"
	"mad/model"
	"mad/router"
	"net/http"
)

type DocsPage struct {
	Title            string
	GroupsMap        map[string]model.GroupBrief
	FullGroupsMap    map[string]*model.Group
	EndpointsMap     map[string]model.EndpointBrief
	FullEndpointsMap map[string]*model.Endpoint
	Api              *model.Api
	ApiSummary       *model.ApiSummary
}

func Handler() *mux.Router {
	m := router.Api()
	m.Get("get:docs").Handler(handler(getDocs))
	return m
}

type handler func(http.ResponseWriter, *http.Request) error

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	LoadTemplates()
	err := h(w, r)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "error: %s", err)
		log.Println(err)
	}
}

func getDocs(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	slug := vars["DOCSLUG"]
	api, _ := services.GetApiBySlug(slug)
	apiSummary, _ := services.GetApiSummary(api)
	groupsMap := make(map[string]model.GroupBrief)
	endpointsMap := make(map[string]model.EndpointBrief)
	fullGroupsMap := make(map[string]*model.Group)
	fullEndpointsMap := make(map[string]*model.Endpoint)

	for _, group := range *apiSummary.Groups {
		groupsMap[group.Id] = group
	}

	for _, endpoint := range *apiSummary.Endpoints {
		endpointsMap[endpoint.Id] = endpoint
	}

	for _, groupId := range (*apiSummary.GroupIds)[0:2] {
		fullGroupsMap[groupId], _ = services.GetGroup(groupId)
		for _, endpointId := range *groupsMap[groupId].Endpoints {
			fullEndpointsMap[endpointId], _ = services.GetEndpoint(endpointId)
		}
	}

	return renderTemplate(w, r, "layout.html", http.StatusOK, &DocsPage{
		Title:            "DocsPage",
		Api:              api,
		GroupsMap:        groupsMap,
		EndpointsMap:     endpointsMap,
		FullGroupsMap:    fullGroupsMap,
		FullEndpointsMap: fullEndpointsMap,
		ApiSummary:       apiSummary,
	})
}

// func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) error {
// 	t, err := template.ParseFiles(tmpl + ".html")
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return err
// 	}
// 	err = t.Execute(w, p)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return err
// 	}
// 	return err
// }
