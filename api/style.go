package api

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"mad/model"
	"net/http"
	"strconv"
)

func getApiStyle(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)

	if err != nil {
		writeJSON(w, errors.New("Api not found with api Id "+apiId))
	}

	currentRevision := strconv.FormatInt(api.CurrentRevision, 10)
	revision, err := store.Revision.Get("Myntra", apiId+"_"+currentRevision)

	if err != nil {
		writeJSON(w, errors.New("Current revision not found with api Id "+apiId))
	}

	return writeJSON(w, &revision.CustomStyle)
}

func updateApiStyle(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)
	if err != nil {
		writeJSON(w, errors.New("Api not found with api Id "+apiId))
	}

	var style model.Style
	err = json.NewDecoder(r.Body).Decode(&style)
	if err != nil {
		writeJSON(w, errors.New("Error while parsing request body "))
	}

	currentRevision := strconv.FormatInt(api.CurrentRevision, 10)
	rev := &model.Revision{Id: apiId + "_" + currentRevision, CustomStyle: &style}
	err = store.Revision.Upsert("Myntra", rev)
	if err != nil {
		writeJSON(w, errors.New("Current revision not found with api Id "+apiId))
	}

	return writeJSON(w, &style)
}
