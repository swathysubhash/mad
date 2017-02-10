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

func createEndpoint(w http.ResponseWriter, r *http.Request) error {
	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)

	if err != nil {
		fmt.Println(err)
		return writeError(w, "C10001", &[]string{})
	}

	currentTime := time.Now().Unix()

	endpoint.EId = bson.NewObjectId().Hex()
	endpoint.Id = endpoint.EId + "_" + strconv.FormatInt(endpoint.Revision, 10)
	endpoint.Object = "subgroup"
	endpoint.Slug = slug.Slug(endpoint.Name)
	endpoint.CreatedBy = "SwathySubhash"
	endpoint.UpdatedBy = "SwathySubhash"
	endpoint.CreatedAt = currentTime
	endpoint.UpdatedAt = currentTime

	if len(endpoint.SubgroupType) == 0 {
		return writeError(w, "C10002", &[]string{"subgroupType"})
	}

	if endpoint.SubgroupType == "endpoint" {
		if len(endpoint.Url) == 0 {
			return writeError(w, "C10002", &[]string{"url"})
		}
		if len(endpoint.Method) == 0 {
			return writeError(w, "C10002", &[]string{"method"})
		}
	}

	if err := validator.Validate(endpoint); err != nil {
		errs, ok := err.(validator.ErrorMap)
		fmt.Println(errs)
		if ok {
			for f, _ := range errs {
				return writeError(w, "C10002", &[]string{f})
			}
		} else {
			return writeError(w, "C10001", &[]string{})
		}
	}

	api, err := store.Api.Get("Myntra", endpoint.ApiId)

	if err != nil {
		return writeError(w, "A90004", &[]string{endpoint.ApiId})
	}

	if api.CurrentRevision != endpoint.Revision {
		return writeError(w, "C10004", &[]string{})
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
	endpointId := vars["ENDPOINTID"]

	endpoint, err := store.Endpoint.Get("Myntra", endpointId)

	if err != nil {
		return writeError(w, "G80002", &[]string{endpointId})
	}

	return writeJSON(w, endpoint)

}

func getAllEndpoint(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	groupId := vars["GROUPID"]
	endpointList, err := store.Endpoint.GetAll("Myntra", groupId)

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
	endpointId := vars["ENDPOINTID"]

	var endpoint model.Endpoint
	err := json.NewDecoder(r.Body).Decode(&endpoint)
	endpoint.Slug = slug.Slug(endpoint.Name)
	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}
	oldEndpoint, err := store.Endpoint.Get("Myntra", endpointId)

	mergo.Merge(&endpoint, oldEndpoint)

	if len(endpoint.SubgroupType) == 0 {
		return writeError(w, "C10002", &[]string{"subgroupType"})
	}

	if endpoint.SubgroupType == "endpoint" {
		if len(endpoint.Url) == 0 {
			return writeError(w, "C10002", &[]string{"url"})
		}
		if len(endpoint.Method) == 0 {
			return writeError(w, "C10002", &[]string{"method"})
		}
	}

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

	fmt.Println("--->", *endpoint.ResponseBody)
	api, err := store.Api.Get("Myntra", endpoint.ApiId)
	if err != nil {
		return writeError(w, "A90004", &[]string{endpoint.ApiId})
	}

	if api.CurrentRevision != endpoint.Revision {
		return writeError(w, "C10004", &[]string{})
	}

	err = store.Endpoint.Update("Myntra", endpointId, &endpoint)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	}

	return writeJSON(w, endpoint)
}

func GetEndpoint(endpointId string) (*model.Endpoint, error) {
	return store.Endpoint.Get("Myntra", endpointId)
}
