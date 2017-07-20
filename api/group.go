package api

import (
	"encoding/json"
	"fmt"
	"github.com/extemporalgenome/slug"
	"github.com/gorilla/mux"
	"github.com/imdario/mergo"
	"github.com/swathysubhash/mad/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/validator.v2"
	"net/http"
	"strconv"
	"time"
)

func createGroup(w http.ResponseWriter, r *http.Request) error {
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
	}

	if CheckAccess(group.ApiId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	currentTime := time.Now().Unix()

	group.GId = bson.NewObjectId().Hex()
	group.Id = group.GId + "_" + strconv.FormatInt(group.Revision, 10)
	group.Object = "group"
	group.Slug = slug.Slug(group.Name)
	group.Endpoints = []string{}

	group.CreatedBy = user
	group.UpdatedBy = user
	group.CreatedAt = currentTime
	group.UpdatedAt = currentTime

	if err := validator.Validate(group); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
		}
	}

	api, err := store.Api.Get("Myntra", group.ApiId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find api with given apiId.")
	}

	if api.CurrentRevision != group.Revision {
		return writeError(w, http.StatusBadRequest, "Group revision is not same as current revision of the api.")
	}

	err = store.Group.Create("Myntra", &group)

	if err != nil {
		fmt.Println(err)
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Group with same name exists")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	return writeJSON(w, group)
}

func getGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]

	group, err := store.Group.Get("Myntra", groupId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Group not found.")
	}

	return writeJSON(w, group)

}

func getAllGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	revision, _ := strconv.ParseInt(vars["REVISION"], 10, 64)
	groupList, err := store.Group.GetAll("Myntra", apiId, revision)

	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error occured while fetching list of groups.")
	}

	return writeJSON(w, &model.GroupListResponse{
		Count:  len(groupList),
		Object: "list",
		Data:   groupList,
	})
}

func updateGroup(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]

	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	var group model.Group
	err := json.NewDecoder(r.Body).Decode(&group)
	group.Slug = slug.Slug(group.Name)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
	}

	oldGroup, err := store.Group.Get("Myntra", groupId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find given group Id")
	}

	mergo.Merge(&group, oldGroup)

	if err := validator.Validate(group); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
		}
	}
	group.UpdatedBy = user
	group.UpdatedAt = time.Now().Unix()

	api, err := store.Api.Get("Myntra", group.ApiId)

	if CheckAccess(api.Id, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find api with given apiId.")
	}

	if api.CurrentRevision != group.Revision {
		return writeError(w, http.StatusBadRequest, "Group revision is not same as current revision of the api.")
	}

	err = store.Group.Update("Myntra", groupId, &group)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Group with same name exists.")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	return writeJSON(w, group)
}

func GetGroup(groupId string) (*model.Group, error) {
	return store.Group.Get("Myntra", groupId)
}

func deleteGroup(w http.ResponseWriter, r *http.Request) error {
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	vars := mux.Vars(r)
	groupId := vars["GROUPID"]

	group, err := GetGroup(groupId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the group.")
	}

	api, err := GetApiById(group.ApiId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the api of the group.")
	}

	if CheckAccess(group.ApiId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	err = store.Revision.RemoveGroup("Myntra", api.Id+"_"+strconv.FormatInt(api.CurrentRevision, 10), groupId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the group in the current revision.")
	}

	err = store.Group.Remove("Myntra", groupId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the group with the given groupId.")
	}

	return writeJSON(w, &model.SuccessResponse{
		Object:  "success",
		Message: "Group deleted successfully",
	})
}
