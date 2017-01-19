package api

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/imdario/mergo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/validator.v2"
	"mad/model"
	"net/http"
	"strconv"
)

func createEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)

	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	endpoint.Id = bson.NewObjectId().Hex()
	endpoint.GroupId = groupId
	endpoint.Object = "endpoint"
	endpoint.Revision = revision
	fmt.Println(endpoint)
	if err := validator.Validate(endpoint); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	err = store.Endpoint.Create("Myntra", &endpoint)

	if err != nil {
		fmt.Println(err)
		if mgo.IsDup(err) {
			return writeError(w, "G80001", &[]string{})
		}
	}

	return writeJSON(w, endpoint)
}

func getEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	endpointId := vars["ENDPOINTID"]

	endpoint, err := store.Endpoint.Get("Myntra", groupId, revision, endpointId)

	if err != nil {
		return writeError(w, "G80002", &[]string{endpointId})
	}

	return writeJSON(w, endpoint)

}

func getAllEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	endpointList, err := store.Endpoint.GetAll("Myntra", groupId, revision)

	if err != nil {
		return writeError(w, "G80003", &[]string{})
	}

	return writeJSON(w, &model.EndpointListResponse{
		Count:  len(*endpointList),
		Object: "list",
		Data:   endpointList,
	})
}

func updateEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	endpointId := vars["endpointId"]

	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	oldEndpoint, err := store.Endpoint.Get("Myntra", groupId, revision, endpointId)

	if err != nil {
		return writeError(w, "G80004", &[]string{groupId})
	}

	mergo.Merge(&endpoint, oldEndpoint)

	if err := validator.Validate(endpoint); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	err = store.Endpoint.Update("Myntra", groupId, revision, endpointId, &endpoint)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	}

	return writeJSON(w, endpoint)
}
