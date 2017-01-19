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
