package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/swathysubhash/mad/model"
	"net/http"
	"strconv"
)

func getApiStyle(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Api not found with given api Id.")
	}

	currentRevision := strconv.FormatInt(api.CurrentRevision, 10)
	revision, err := store.Revision.Get("Myntra", apiId+"_"+currentRevision)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Current revision not found with api Id.")
	}

	return writeJSON(w, &revision.CustomStyle)
}

func updateApiStyle(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	api, err := store.Api.Get("Myntra", apiId)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Api not found with given api Id.")
	}

	var style model.Style
	err = json.NewDecoder(r.Body).Decode(&style)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while parsing request body.")
	}

	currentRevision := strconv.FormatInt(api.CurrentRevision, 10)
	rev := &model.Revision{Id: apiId + "_" + currentRevision, CustomStyle: &style}
	err = store.Revision.Upsert("Myntra", rev)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Current revision not found with api Id.")
	}

	return writeJSON(w, &style)
}
