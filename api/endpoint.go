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

func createEndpoint(w http.ResponseWriter, r *http.Request) error {
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
	}

	if CheckAccess(endpoint.ApiId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	currentTime := time.Now().Unix()

	endpoint.EId = bson.NewObjectId().Hex()
	endpoint.Id = endpoint.EId + "_" + strconv.FormatInt(endpoint.Revision, 10)
	endpoint.Object = "subgroup"
	endpoint.Slug = slug.Slug(endpoint.Name)
	endpoint.CreatedBy = user
	endpoint.UpdatedBy = user
	endpoint.CreatedAt = currentTime
	endpoint.UpdatedAt = currentTime

	if len(endpoint.SubgroupType) == 0 {
		return writeError(w, http.StatusBadRequest, "Subgroup type not found.")
	}

	if endpoint.SubgroupType == "endpoint" {
		if len(endpoint.Url) == 0 {
			return writeError(w, http.StatusBadRequest, "url field not found.")
		}
		if len(endpoint.Method) == 0 {
			return writeError(w, http.StatusBadRequest, "method field not found.")
		}
	}

	if err := validator.Validate(endpoint); err != nil {
		errs, ok := err.(validator.ErrorMap)
		fmt.Println(errs)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error while decoding request body")
		}
	}

	api, err := store.Api.Get("Myntra", endpoint.ApiId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find api with given apiId")
	}

	if api.CurrentRevision != endpoint.Revision {
		return writeError(w, http.StatusBadRequest, "Endpoint revision is not same as current revision of the api")
	}

	err = store.Endpoint.Create("Myntra", &endpoint)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Endpoint with same name exists")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	return writeJSON(w, endpoint)
}

func getEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	endpointId := vars["ENDPOINTID"]

	endpoint, err := store.Endpoint.Get("Myntra", endpointId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Endpoint not found")
	}

	return writeJSON(w, endpoint)

}

func getAllEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	endpointList, err := store.Endpoint.GetAll("Myntra", groupId)

	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error occured while fetching list of endpoints")
	}

	return writeJSON(w, &model.EndpointListResponse{
		Count:  len(endpointList),
		Object: "list",
		Data:   endpointList,
	})
}

func updateEndpoint(w http.ResponseWriter, r *http.Request) error {
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	vars := mux.Vars(r)
	endpointId := vars["ENDPOINTID"]

	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)
	endpoint.Slug = slug.Slug(endpoint.Name)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error occured while decoding request body.")
	}
	oldEndpoint, err := store.Endpoint.Get("Myntra", endpointId)

	mergo.Merge(&endpoint, oldEndpoint)

	if len(endpoint.SubgroupType) == 0 {
		return writeError(w, http.StatusBadRequest, "subgroup field not found.")
	}

	if endpoint.SubgroupType == "endpoint" {
		if len(endpoint.Url) == 0 {
			return writeError(w, http.StatusBadRequest, "url field not found.")
		}
		if len(endpoint.Method) == 0 {
			return writeError(w, http.StatusBadRequest, "method field not found.")
		}
	}

	if err := validator.Validate(endpoint); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error while decoding request body.")
		}
	}
	endpoint.UpdatedBy = user
	endpoint.UpdatedAt = time.Now().Unix()
	api, err := store.Api.Get("Myntra", endpoint.ApiId)

	if CheckAccess(api.Id, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find api with given api Id")
	}

	if api.CurrentRevision != endpoint.Revision {
		return writeError(w, http.StatusBadRequest, "Revision of the endpoint is not same as the current revision of the api.")
	}

	err = store.Endpoint.Update("Myntra", endpointId, &endpoint)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusInternalServerError, "Endpoint exists with same id")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	return writeJSON(w, endpoint)
}

func GetEndpoint(endpointId string) (*model.Endpoint, error) {
	return store.Endpoint.Get("Myntra", endpointId)
}

func deleteEndpoint(w http.ResponseWriter, r *http.Request) error {
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	vars := mux.Vars(r)
	endpointId := vars["ENDPOINTID"]

	endpoint, err := GetEndpoint(endpointId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the subgroup.")
	}

	if CheckAccess(endpoint.ApiId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	err = store.Group.RemoveSubgroup("Myntra", endpoint.GroupId, endpointId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the subgroup in the group.")
	}

	err = store.Endpoint.Remove("Myntra", endpointId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find the endpoint with the given endpointId.")
	}

	return writeJSON(w, &model.SuccessResponse{
		Object:  "success",
		Message: "Subgroup deleted successfully",
	})
}
