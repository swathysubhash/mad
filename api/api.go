package api

import (
	"encoding/json"
	"fmt"
	"github.com/extemporalgenome/slug"
	"github.com/gorilla/mux"
	"github.com/imdario/mergo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/validator.v2"
	"mad/model"
	"net/http"
	"strconv"
)

func createApi(w http.ResponseWriter, r *http.Request) error {
	var api model.Api
	err := json.NewDecoder(r.Body).Decode(&api)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	if err := validator.Validate(api); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	api.Slug = slug.Slug(api.Name + "-" + api.Version)
	api.Id = bson.NewObjectId().Hex()
	api.Object = "api"
	api.CurrentRevision = 0
	api.PublishedRevision = -1

	err = store.Api.Create("Myntra", &api)

	if err != nil {
		fmt.Println("err", err)
		if mgo.IsDup(err) {
			return writeError(w, "A90001", &[]string{api.Slug})
		}
	}

	return writeJSON(w, api)
}

func getApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	api, err := store.Api.Get("Myntra", apiId)

	if err != nil {
		return writeError(w, "A90002", &[]string{apiId})
	}

	return writeJSON(w, api)

}

func getAllApi(w http.ResponseWriter, r *http.Request) error {
	apiList, err := store.Api.GetAll("Myntra")

	if err != nil {
		return writeError(w, "A90003", &[]string{})
	}

	return writeJSON(w, &model.ApiListResponse{
		Count:  len(*apiList),
		Object: "list",
		Data:   apiList,
	})
}

func updateApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	var api model.Api
	err := json.NewDecoder(r.Body).Decode(&api)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	oldApi, err := store.Api.Get("Myntra", apiId)

	if err != nil {
		return writeError(w, "A90004", &[]string{apiId})
	}

	// No manual update for following fields
	api.CurrentRevision = oldApi.CurrentRevision
	api.PublishedRevision = oldApi.PublishedRevision

	mergo.Merge(&api, oldApi)
	api.Slug = slug.Slug(api.Name + "-" + api.Version)

	if err := validator.Validate(api); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	err = store.Api.Update("Myntra", apiId, &api)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	}

	return writeJSON(w, api)
}

func publishApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)

	currentRevision := api.CurrentRevision
	newRevision := currentRevision + 1

	s_newRevision := strconv.FormatInt(newRevision, 10)
	s_currentRevision := strconv.FormatInt(currentRevision, 10)

	newGroups := make([]model.Group, 0, 0)
	newEndpoints := make([]model.Endpoint, 0, 0)

	groups, err := store.Group.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	endpoints, err := store.Endpoint.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	for _, group := range *groups {
		group.Id = group.GId + "_" + s_newRevision
		group.Revision = newRevision
		eps := make([]string, 0, 0)
		for _, ep := range *group.Endpoints {
			eps = append(eps, getSplitId(ep)+"_"+s_newRevision)
		}
		group.Endpoints = &eps
		newGroups = append(newGroups, group)
	}

	for _, endpoint := range *endpoints {
		endpoint.Id = endpoint.EId + "_" + s_newRevision
		endpoint.GroupId = getSplitId(endpoint.GroupId) + "_" + s_newRevision
		endpoint.Revision = newRevision
		newEndpoints = append(newEndpoints, endpoint)
	}

	revision, err := store.Revision.Get("Myntra", apiId+"_"+s_currentRevision)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	gIds := make([]string, 0, 0)
	for _, gId := range *revision.GroupList {
		gIds = append(gIds, getSplitId(gId)+"_"+s_newRevision)
	}
	revision.GroupList = &gIds

	revision.Id = getSplitId(revision.Id) + "_" + s_newRevision
	revision.Number = newRevision

	err = store.Revision.Upsert("Myntra", revision)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	err = store.Group.UpsertMany("Myntra", &newGroups)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	err = store.Endpoint.UpsertMany("Myntra", &newEndpoints)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	api.PublishedRevision = currentRevision
	api.CurrentRevision = newRevision

	err = store.Api.Update("Myntra", api.Id, api)
	if err != nil {
		return writeError(w, "C10005", &[]string{})
	}

	return writeJSON(w, &model.SuccessResponse{
		Object:  "success",
		Message: "Api published successfully",
	})

}

func summaryApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)
	if err != nil {
		return writeError(w, "A90002", &[]string{apiId})
	}
	currentRevision := api.CurrentRevision
	s_currentRevision := strconv.FormatInt(currentRevision, 10)

	revision, err := store.Revision.Get("Myntra", apiId+"_"+s_currentRevision)
	if err != nil {
		return writeError(w, "R20001", &[]string{apiId})
	}
	groups, err := store.Group.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, "G80005", &[]string{apiId})
	}

	endpoints, err := store.Endpoint.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, "E30001", &[]string{apiId})
	}

	groupBriefs := make([]model.GroupBrief, 0, 0)
	endpointBriefs := make([]model.EndpointBrief, 0, 0)

	for _, group := range *groups {
		groupBriefs = append(groupBriefs, model.GroupBrief{
			Id:        group.Id,
			Name:      group.Name,
			Object:    group.Object,
			Separator: group.Separator,
			Endpoints: group.Endpoints,
		})
	}

	for _, endpoint := range *endpoints {
		endpointBriefs = append(endpointBriefs, model.EndpointBrief{
			Id:      endpoint.Id,
			Name:    endpoint.Name,
			GroupId: endpoint.GroupId,
			Method:  endpoint.Method,
			Object:  endpoint.Object,
		})
	}

	return writeJSON(w, &model.ApiSummary{
		ApiId:           apiId,
		Object:          "summary",
		CurrentRevision: currentRevision,
		GroupIds:        revision.GroupList,
		Groups:          &groupBriefs,
		Endpoints:       &endpointBriefs,
	})
}
