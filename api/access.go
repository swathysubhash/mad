package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/swathysubhash/mad/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/validator.v2"
	"net/http"
	"time"
)

func convertPermission(permission string) ([]int, error) {
	permissionMap := make(map[string][]int)
	permissionMap["none"] = []int{0, 0, 0}
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
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while decoding request body.")
	}

	if CheckAccess(access.ResourceId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	currentTime := time.Now().Unix()

	access.Object = "access"
	access.CreatedBy = user
	access.UpdatedBy = user
	access.CreatedAt = currentTime
	access.UpdatedAt = currentTime
	access.PermissionSlice, err = convertPermission(access.Permission)

	if err := validator.Validate(access); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error while decoding request body.")
		}
	}

	err = store.Access.Create("Myntra", &access)

	if err != nil {
		fmt.Println(err)
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Duplicate access error")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	return writeJSON(w, access)
}

func updateAccess(w http.ResponseWriter, r *http.Request) error {
	var access model.Access
	err := json.NewDecoder(r.Body).Decode(&access)
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while decoding request body.")
	}

	if CheckAccess(access.ResourceId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	access.UpdatedAt = time.Now().Unix()
	access.UpdatedBy = user
	access.PermissionSlice, err = convertPermission(access.Permission)
	err = store.Access.Update("Myntra", &access)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Duplicate access error")
		}
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
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
		return writeError(w, http.StatusInternalServerError, "Error while fetching all accesses.")
	}

	return writeJSON(w, &model.AccessListResponse{
		Count:  len(accessList),
		Object: "list",
		Data:   accessList,
	})
}

func CheckAccess(resourceId, resourceType, actorId, permission string) bool {
	if resourceType == "api" {
		api, err := store.Api.Get("Myntra", resourceId)
		if err != nil {
			return false
		}
		if getPermission(api.AnonymousAccessSlice, permission) {
			return true
		}
	}

	access, err := store.Access.Get("Myntra", resourceId, actorId)
	if err != nil {
		return false
	}

	return getPermission(access.PermissionSlice, permission)
}
