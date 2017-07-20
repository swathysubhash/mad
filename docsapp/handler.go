package docsapp

import (
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	// "html/template"
	"bytes"
	"encoding/json"
	services "github.com/swathysubhash/mad/api"
	"github.com/swathysubhash/mad/model"
	"github.com/swathysubhash/mad/router"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type DocsPage struct {
	Title            string
	GroupsMap        map[string]model.GroupBrief
	FullGroupsMap    map[string]*model.Group
	EndpointsMap     map[string]model.EndpointBrief
	FullEndpointsMap map[string]*model.Endpoint
	Api              *model.Api
	ApiSummary       *model.ApiSummary
	Revision         *model.Revision
	Assets           *Assets
}

type Assets struct {
	Js  string `json:"bundle.js"`
	Css string `json:"style.css"`
}

type GroupSection struct {
	Group *model.Group
}
type EndpointSection struct {
	Endpoint *model.Endpoint
}

var assets Assets
var cwd, _ = os.Getwd()
var BuildDir = filepath.Join(cwd, "docsapp", "static", "build")

func init() {
	file, err := ioutil.ReadFile(BuildDir + "/manifest.json")
	if err != nil {
		log.Printf("Not able to find asset file.Error: %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &assets)
}

func Handler() *mux.Router {
	m := router.Api()
	m.Get("get:docs").Handler(handler(getDocs))
	m.Get("get:docs:section").Handler(handler(getSection))
	m.Get("get:docs:tryout").Handler(handler(tryOut))
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
	api, err := services.GetApiBySlug(slug)

	if err != nil {
		w.Write([]byte(err.Error()))
		return nil
	}

	q := r.URL.Query()
	current := "0"
	currents, ok := q["c"]
	if ok {
		current = currents[0]
	}

	var revision *model.Revision
	if current == "1" {
		revision, err = services.GetRevisionByApiId(api.Id, api.CurrentRevision)
	} else {
		revision, err = services.GetRevisionByApiId(api.Id, api.PublishedRevision)
	}

	if err != nil {
		w.Write([]byte(err.Error()))
		return nil
	}

	apiSummary, _ := services.GetApiSummary(api, revision.Number)
	groupsMap := make(map[string]model.GroupBrief)
	endpointsMap := make(map[string]model.EndpointBrief)
	fullGroupsMap := make(map[string]*model.Group)
	fullEndpointsMap := make(map[string]*model.Endpoint)

	for _, group := range apiSummary.Groups {
		groupsMap[group.Id] = group
	}

	for _, endpoint := range apiSummary.Endpoints {
		endpointsMap[endpoint.Id] = endpoint
	}

	gLen := 2
	if len(apiSummary.GroupIds) < 2 {
		gLen = len(apiSummary.GroupIds)
	}

	for _, groupId := range (apiSummary.GroupIds)[0:gLen] {
		fullGroupsMap[groupId], _ = services.GetGroup(groupId)
		if fullGroupsMap[groupId] != nil {
			for _, endpointId := range groupsMap[groupId].Endpoints {
				fullEndpointsMap[endpointId], _ = services.GetEndpoint(endpointId)
				if fullEndpointsMap[endpointId] != nil {
					if fullEndpointsMap[endpointId].SubgroupType == "schema" {
						schemaMap := make(map[string]interface{})
						json.Unmarshal([]byte(fullEndpointsMap[endpointId].Schema), &schemaMap)
						fullEndpointsMap[endpointId].SchemaMap = schemaMap
					} else if fullEndpointsMap[endpointId].SubgroupType == "endpoint" {
						fullEndpointsMap[endpointId].Url = api.Protocol + "://" + api.Host + fullEndpointsMap[endpointId].Url
					}
				}
			}
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
		Revision:         revision,
		Assets:           &assets,
	})
}

func getSection(w http.ResponseWriter, r *http.Request) error {
	q := r.URL.Query()
	sectionType, ok := q["type"]
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("type query parameter missing"))
		return nil
	}
	sectionId, ok := q["id"]
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("id query parameter is required"))
		return nil
	}

	var htmlString string
	var sectionEndpoint *model.SectionEndpoint
	if sectionType[0] == "group" {
		group, err := services.GetGroup(sectionId[0])

		if err != nil {
			w.Write([]byte(err.Error()))
			return nil
		}
		htmlString, _ = renderTemplateString(w, r, "group.html", http.StatusOK, &GroupSection{
			Group: group,
		})
	}

	if sectionType[0] == "subgroup" {
		subgroup, err := services.GetEndpoint(sectionId[0])
		if subgroup.SubgroupType == "schema" {
			schemaMap := make(map[string]interface{})
			json.Unmarshal([]byte(subgroup.Schema), &schemaMap)
			subgroup.SchemaMap = schemaMap
		} else if subgroup.SubgroupType == "endpoint" {
			api, err := services.GetApiById(subgroup.ApiId)
			if err != nil {
				w.Write([]byte(err.Error()))
				return nil
			}
			subgroup.Url = api.Protocol + "://" + api.Host + subgroup.Url
		}
		if err != nil {
			w.Write([]byte(err.Error()))
			return nil
		}

		htmlString, _ = renderTemplateString(w, r, "subgroup.html", http.StatusOK, &EndpointSection{
			Endpoint: subgroup,
		})

		if subgroup.SubgroupType == "endpoint" {
			sectionEndpoint = &model.SectionEndpoint{
				Id:              subgroup.Id,
				Method:          subgroup.Method,
				Url:             subgroup.Url,
				RequestHeaders:  subgroup.RequestHeaders,
				UrlParameters:   subgroup.UrlParameters,
				QueryParameters: subgroup.QueryParameters,
			}
		}
	}

	sectionResponse, err := json.Marshal(&model.SectionResponse{
		HtmlString:  htmlString,
		SectionData: sectionEndpoint,
	})

	if err != nil {
		return err
	}

	w.Write([]byte(sectionResponse))
	return nil
}

func tryOut(w http.ResponseWriter, r *http.Request) error {
	var treq model.TryoutRequest
	err := json.NewDecoder(r.Body).Decode(&treq)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return nil
	}

	var reqBody *bytes.Buffer
	if len(treq.RequestBody) > 0 {
		reqBody = bytes.NewBuffer(([]byte(treq.RequestBody)))
	} else {
		reqBody = bytes.NewBuffer(([]byte("{}")))
	}

	req, err := http.NewRequest(treq.Method, treq.Url, reqBody)

	for _, header := range treq.RequestHeaders {
		req.Header.Add(header.Name, header.Value)
	}
	timeout := time.Duration(5 * time.Second)
	client := &http.Client{
		Timeout: timeout,
	}
	resp, err := client.Do(req)

	fmt.Println(err)
	if err != nil {

		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		tryOutResponse, err := json.Marshal(&model.TryoutResponse{
			Error:      err.Error(),
			StatusCode: 500,
			Status:     "500 Internal Server Error",
			Data:       "",
		})

		if err != nil {
			return err
		}
		w.Write([]byte(tryOutResponse))
	} else {
		defer resp.Body.Close()
		htmlData, err := ioutil.ReadAll(resp.Body)

		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		tryOutResponse, err := json.Marshal(&model.TryoutResponse{
			Error:      "",
			StatusCode: resp.StatusCode,
			Status:     resp.Status,
			Data:       string(htmlData),
		})

		if err != nil {
			return err
		}
		w.Write([]byte(tryOutResponse))
	}

	return nil
}
