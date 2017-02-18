package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"gopkg.in/validator.v2"
	"mad/model"
	"net/http"
	"time"
)

func convertPermission(permission string) ([]int, error) {
	permissionMap := make(map[string][]int)
	permissionMap["read"] = []int{1, 0, 0}
	permissionMap["write"] = []int{1, 1, 0}
	permissionMap["admin"] = []int{1, 1, 1}
	if permissionMap[permission] != nil {
		return permissionMap[permission], nil
	} else {
		return nil, errors.New("Invalid permission")
	}
}

func getPermission(permissionSlice []int, permission string) bool {
	switch permission {
	case "read":
		return permissionSlice[0] == 1
	case "write":
		return permissionSlice[1] == 1
	case "admin":
		return permissionSlice[2] == 1
	default:
		return false
	}
}

func createAccess(w http.ResponseWriter, r *http.Request) error {
	var access model.Access
	err := json.NewDecoder(r.Body).Decode(&access)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	currentTime := time.Now().Unix()

	access.Object = "access"
	access.CreatedBy = "SwathySubhash"
	access.UpdatedBy = "SwathySubhash"
	access.CreatedAt = currentTime
	access.UpdatedAt = currentTime
	access.PermissionSlice, err = convertPermission(access.Permission)

	if err := validator.Validate(access); err != nil {
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

	err = store.Access.Create("Myntra", &access)

	if err != nil {
		fmt.Println(err)
		if mgo.IsDup(err) {
			return writeError(w, "G80001", &[]string{})
		}
	}

	return writeJSON(w, access)
}

func updateAccess(w http.ResponseWriter, r *http.Request) error {
	var access model.Access
	err := json.NewDecoder(r.Body).Decode(&access)

	if err != nil {
		return writeError(w, "C10001", &[]string{})
	}

	access.UpdatedAt = time.Now().Unix()
	access.UpdatedBy = "swathysubhash@gmail.com"
	access.PermissionSlice, err = convertPermission(access.Permission)
	err = store.Access.Update("Myntra", &access)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, "C10003", &[]string{})
		}
	} else {
		updated, _ := store.Access.Get("Myntra", access.ResourceId, access.ActorId)
		return writeJSON(w, updated)
	}
	return writeJSON(w, access)
}

func getAllAccess(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	resourceId := vars["RESOURCEID"]
	accessList, err := store.Access.GetAllByResourceId("Myntra", resourceId)

	if err != nil {
		return writeError(w, "G80003", &[]string{})
	}

	return writeJSON(w, &model.AccessListResponse{
		Count:  len(accessList),
		Object: "list",
		Data:   accessList,
	})
}

func CheckAccess(resourceId, actorId, permission string) bool {
	access, err := store.Access.Get("Myntra", resourceId, actorId)

	if err != nil {
		fmt.Println(err)
		return false
	}

	return getPermission(access.PermissionSlice, permission)
}
