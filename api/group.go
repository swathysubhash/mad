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
	"time"
)

func createGroup(w http.ResponseWriter, r *http.Request) error {
	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	currentTime := time.Now().Unix()

	group.GId = bson.NewObjectId().Hex()
	group.Id = group.GId + "_" + strconv.FormatInt(group.Revision, 10)
	group.Object = "group"
	group.Slug = slug.Slug(group.Name)
	group.Endpoints = &[]string{}

	group.CreatedBy = "SwathySubhash"
	group.UpdatedBy = "SwathySubhash"
	group.CreatedAt = currentTime
	group.UpdatedAt = currentTime

	if err := validator.Validate(group); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			fmt.Println(errs)
			return writeError(w, "C10001", &[]string{})
		}
	}

	api, err := store.Api.Get("Myntra", group.ApiId)

	if err != nil {
		return writeError(w, "A90004", &[]string{group.ApiId})
	}

	if api.CurrentRevision != group.Revision {
		return writeError(w, "C10004", &[]string{})
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
	groupId := vars["GROUPID"]

	group, err := store.Group.Get("Myntra", groupId)

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
	groupId := vars["GROUPID"]

	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)
	group.Slug = slug.Slug(group.Name)
	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	oldGroup, err := store.Group.Get("Myntra", groupId)

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

	api, err := store.Api.Get("Myntra", group.ApiId)

	if err != nil {
		return writeError(w, "A90004", &[]string{group.ApiId})
	}

	if api.CurrentRevision != group.Revision {
		return writeError(w, "C10004", &[]string{})
	}

	err = store.Group.Update("Myntra", groupId, &group)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	}

	return writeJSON(w, group)
}

func GetGroup(groupId string) (*model.Group, error) {
	return store.Group.Get("Myntra", groupId)
}
