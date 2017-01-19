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

func createGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)

	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	group.Id = bson.NewObjectId().Hex()
	group.ApiId = apiId
	group.Object = "group"
	group.Revision = revision
	group.Endpoints = &[]string{}

	if err := validator.Validate(group); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	err = store.Group.Create("Myntra", &group)

	if err != nil {
		fmt.Println(err)
		if mgo.IsDup(err) {
			return writeError(w, "G80001", &[]string{})
		}
	}

	return writeJSON(w, group)
}

func getGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	groupId := vars["GROUPID"]

	group, err := store.Group.Get("Myntra", apiId, revision, groupId)

	if err != nil {
		return writeError(w, "G80002", &[]string{groupId})
	}

	return writeJSON(w, group)

}

func getAllGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	groupList, err := store.Group.GetAll("Myntra", apiId, revision)

	if err != nil {
		return writeError(w, "G80003", &[]string{})
	}

	return writeJSON(w, &model.GroupListResponse{
		Count:  len(*groupList),
		Object: "list",
		Data:   groupList,
	})
}

func updateGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	groupId := vars["GROUPID"]

	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	oldGroup, err := store.Group.Get("Myntra", apiId, revision, groupId)

	if err != nil {
		return writeError(w, "G80004", &[]string{groupId})
	}

	mergo.Merge(&group, oldGroup)

	if err := validator.Validate(group); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	err = store.Group.Update("Myntra", apiId, revision, groupId, &group)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	}

	return writeJSON(w, group)
}
