package api

import (
	"encoding/json"
	"fmt"
	"mad/model"
	"net/http"
	"strconv"
	"strings"
)

var ErrorMessages = map[string]string{
	"C10001": "Invalid input format",
	"C10002": "Missing/Incorrect format for {0} field",
	"C10003": "Update failed",
	"C10004": "Revision which you are trying to update is not the current revision.",
	"C10005": "Api publish failed",
	"A90001": "Api with {0} combination already exists. Please try with some other name",
	"A90002": "Not able to get api details of {0}",
	"A90003": "Not able to fetch the list of apis",
	"A90004": "Api with id {0} not found",
	"A90005": "Api with revision {0} not found",
	"G80001": "Group with same name already exists. Please try with some other name",
	"G80002": "Not able to get group details of {0}",
	"G80003": "Not able to fetch the list of groups",
	"G80004": "Group with id {0} not found",
	"G80005": "Group with api id {0} not found",
	"R20001": "Revision data for api id {0} not found",
	"E30001": "Endpoint data for api id {0} not found",
}

func writeJSON(w http.ResponseWriter, v interface{}) error {
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_, err = w.Write(data)
	return err
}

func writeError(w http.ResponseWriter, code string, args *[]string) error {
	message := ErrorMessages[code]

	if message == "" {
		message = "Oops. There has been some issue on our servers. Please try again"
	}

	for index, arg := range *args {
		fmt.Println(index, arg, "{"+strconv.Itoa(index)+"}", message)
		message = strings.Replace(message, "{"+strconv.Itoa(index)+"}", arg, -1)
	}

	w.WriteHeader(http.StatusBadRequest)

	return writeJSON(w, &model.ErrorResponse{
		Object:  "error",
		Code:    code,
		Message: message,
	})
}

func getSplitId(str string) string {
	splits := strings.Split(str, "_")
	return splits[0]
}
