package api

import (
	"encoding/json"
	"github.com/swathysubhash/mad/model"
	"net/http"
	"strings"
)

func writeJSON(w http.ResponseWriter, v interface{}) error {
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_, err = w.Write(data)
	return err
}

func writeError(w http.ResponseWriter, statusCode int, message string) error {
	w.WriteHeader(statusCode)
	return writeJSON(w, &model.ErrorResponse{
		Object:  "error",
		Message: message,
	})
}

func getSplitId(str string) string {
	splits := strings.Split(str, "_")
	return splits[0]
}
