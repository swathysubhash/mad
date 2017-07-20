package api

import (
	"encoding/json"
	"errors"
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

func createApi(w http.ResponseWriter, r *http.Request) error {
	var api model.Api
	err := json.NewDecoder(r.Body).Decode(&api)
	user := r.Context().Value("userid").(string)

	if len(user) == 0 {
		return writeError(w, http.StatusBadRequest, "User not logged in.")
	}

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while parsing request body.")
	}

	if err := validator.Validate(api); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while parsing request body. Error with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error while parsing request body.")
		}
	}

	currentTime := time.Now().Unix()

	api.Slug = slug.Slug(api.Name + "-" + api.Version)
	api.Id = bson.NewObjectId().Hex()
	api.Object = "api"
	api.CurrentRevision = 0
	api.PublishedRevision = -1
	api.CreatedBy = user
	api.UpdatedBy = user
	api.CreatedAt = currentTime
	api.UpdatedAt = currentTime
	api.AnonymousAccessSlice = []int{0, 0, 0} // {r, w, a}
	api.AnonymousAccess = "none"              // {r, w, a}

	err = store.Api.Create("Myntra", &api)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Api with the same name exits.")
		}
		return writeError(w, http.StatusInternalServerError, "Error occured while creating api.")
	}

	return writeJSON(w, api)
}

func getApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]
	api, err := store.Api.Get("Myntra", apiId)

	user := r.Context().Value("userid").(string)
	if CheckAccess(apiId, "api", user, "read") == false {
		return writeError(w, http.StatusForbidden, "Read permission denied. Please contact the owner.")
	}

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Not able to find api with given id.")
	}

	return writeJSON(w, api)

}

func getAllApi(w http.ResponseWriter, r *http.Request) error {
	q := r.URL.Query()
	gt := ""
	lt := ""
	limit := 8
	next := ""
	previous := ""
	gts, ok := q["gt"]
	if ok {
		gt = gts[0]
	}
	lts, ok := q["lt"]
	if ok {
		lt = lts[0]
	}
	limits, ok := q["limit"]
	if ok {
		limit, _ = strconv.Atoi(limits[0])
	}
	vars := mux.Vars(r)
	createdBy := vars["CREATEDBY"]

	user := r.Context().Value("userid").(string)
	if len(createdBy) > 0 && user != createdBy {
		return writeError(w, http.StatusForbidden, "Permission denied.")
	}

	apiList, err := store.Api.GetAll("Myntra", gt, lt, limit+1, createdBy)

	baseUrl := "/madapi/apis"
	if len(createdBy) > 0 {
		baseUrl = baseUrl + "/createdby/" + createdBy
	}

	if len(apiList) == limit+1 {
		apiList = apiList[:len(apiList)-1]
		next = baseUrl + "?lt=" + apiList[limit-1].Id + "&limit=" + strconv.Itoa(limit)
		if len(lt) > 0 || len(gt) > 0 {
			previous = baseUrl + "?gt=" + apiList[0].Id + "&limit=" + strconv.Itoa(limit)
		}
	} else if len(lt) > 0 {
		next = ""
		previous = baseUrl + "?gt=" + apiList[0].Id + "&limit=" + strconv.Itoa(limit)
	} else if len(gt) > 0 {
		next = baseUrl + "?lt=" + apiList[limit-1].Id + "&limit=" + strconv.Itoa(limit)
		previous = ""
	}

	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while fetching list of apis.")
	}

	return writeJSON(w, &model.ApiListResponse{
		Count:  len(apiList),
		Object: "list",
		Data:   apiList,
		Pagination: &model.Pagination{
			Next:     next,
			Previous: previous,
		},
	})
}

func getAllApiByMe(w http.ResponseWriter, r *http.Request) error {
	return getAllApi(w, r)
}

func updateApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	user := r.Context().Value("userid").(string)
	if CheckAccess(apiId, "api", user, "write") == false {
		return writeError(w, http.StatusForbidden, "Write permission denied. Please contact the owner.")
	}

	var api model.Api
	err := json.NewDecoder(r.Body).Decode(&api)

	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while decoding request body.")
	}

	oldApi, err := store.Api.Get("Myntra", apiId)

	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Server error occured. Please try again.")
	}

	// No manual update for following fields
	api.CurrentRevision = oldApi.CurrentRevision
	api.PublishedRevision = oldApi.PublishedRevision

	if len(api.AnonymousAccess) > 0 {
		api.AnonymousAccessSlice, _ = convertPermission(api.AnonymousAccess)
	}

	mergo.Merge(&api, oldApi)
	api.Slug = slug.Slug(api.Name + "-" + api.Version)
	api.UpdatedBy = user
	api.UpdatedAt = time.Now().Unix()

	if err := validator.Validate(api); err != nil {
		errs, ok := err.(validator.ErrorMap)
		if ok {
			for f, _ := range errs {
				return writeError(w, http.StatusBadRequest, "Error while decoding request body. Issue with field - "+f)
			}
		} else {
			return writeError(w, http.StatusBadRequest, "Error while decoding request body")
		}
	}

	err = store.Api.Update("Myntra", apiId, &api)

	if err != nil {
		if mgo.IsDup(err) {
			return writeError(w, http.StatusBadRequest, "Bad request")
		}
		return writeError(w, http.StatusInternalServerError, "Error occured while updating api")
	}

	return writeJSON(w, api)
}

func publishApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	user := r.Context().Value("userid").(string)
	if CheckAccess(apiId, "api", user, "admin") == false {
		return writeError(w, http.StatusForbidden, "Publish permission denied. You will need admin permission for publishing the document. Please contact the owner.")
	}

	api, err := store.Api.Get("Myntra", apiId)

	currentRevision := api.CurrentRevision
	newRevision := currentRevision + 1

	s_newRevision := strconv.FormatInt(newRevision, 10)
	s_currentRevision := strconv.FormatInt(currentRevision, 10)

	newGroups := make([]model.Group, 0, 0)
	newEndpoints := make([]model.Endpoint, 0, 0)
	groups, err := store.Group.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while fetching groups of the current revision. Please try again.")
	}

	endpoints, err := store.Endpoint.GetByApi("Myntra", apiId, currentRevision)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while fetching endpoints of the current revision. Please try again.")
	}

	for _, group := range groups {
		group.Id = group.GId + "_" + s_newRevision
		group.Revision = newRevision
		eps := make([]string, 0, 0)
		for _, ep := range group.Endpoints {
			eps = append(eps, getSplitId(ep)+"_"+s_newRevision)
		}
		group.Endpoints = eps
		newGroups = append(newGroups, group)
	}

	for _, endpoint := range endpoints {
		endpoint.Id = endpoint.EId + "_" + s_newRevision
		endpoint.GroupId = getSplitId(endpoint.GroupId) + "_" + s_newRevision
		endpoint.Revision = newRevision
		newEndpoints = append(newEndpoints, endpoint)
	}

	revision, err := store.Revision.Get("Myntra", apiId+"_"+s_currentRevision)
	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while fetching revision data of the current revision. Please try again.")
	}

	gIds := make([]string, 0, 0)
	for _, gId := range revision.GroupList {
		gIds = append(gIds, getSplitId(gId)+"_"+s_newRevision)
	}
	revision.GroupList = gIds
	revision.Id = getSplitId(revision.Id) + "_" + s_newRevision
	revision.Number = newRevision

	err = store.Revision.Upsert("Myntra", revision)
	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while updating revision data for new revision. Please try again.")
	}

	err = store.Group.UpsertMany("Myntra", newGroups)
	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while updating group data for new revision. Please try again.")
	}
	err = store.Endpoint.UpsertMany("Myntra", newEndpoints)
	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while updating endpoint data for new revision. Please try again.")
	}

	api.PublishedRevision = currentRevision
	api.CurrentRevision = newRevision

	err = store.Api.Update("Myntra", api.Id, api)
	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while updating api data for new revision. Please try again.")
	}

	return writeJSON(w, &model.SuccessResponse{
		Object:  "success",
		Message: "Api published successfully",
	})

}

func deleteApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	user := r.Context().Value("userid").(string)
	if CheckAccess(apiId, "api", user, "admin") == false {
		return writeError(w, http.StatusForbidden, "Delete permission denied. Please contact the owner.")
	}

	err := store.Api.Remove("Myntra", apiId)

	if err != nil {
		return writeError(w, http.StatusInternalServerError, "Error while deleting api data. Please try again.")
	}

	return writeJSON(w, &model.SuccessResponse{
		Object:  "success",
		Message: "Api deleted successfully",
	})
}

func summaryApi(w http.ResponseWriter, r *http.Request) error {
	vars := mux.Vars(r)
	apiId := vars["APIID"]

	user := r.Context().Value("userid").(string)
	if CheckAccess(apiId, "api", user, "read") == false {
		return writeError(w, http.StatusForbidden, "Read permission denied. Please contact the owner.")
	}

	api, err := store.Api.Get("Myntra", apiId)
	if err != nil {
		return writeError(w, http.StatusBadRequest, "Error while fetching api with given id.")
	}

	apiSummary, err := GetApiSummary(api, api.CurrentRevision)

	if err != nil {
		return writeJSON(w, err)
	}

	return writeJSON(w, apiSummary)
}

func GetApiBySlug(slug string) (*model.Api, error) {
	api, err := store.Api.GetBySlug("Myntra", slug)
	if err != nil {
		return nil, errors.New("Api not found with slug name " + slug)
	}
	return api, nil
}

func GetApiById(apiId string) (*model.Api, error) {
	api, err := store.Api.Get("Myntra", apiId)
	if err != nil {
		return nil, errors.New("Api not found with api id " + apiId)
	}
	return api, nil
}

func GetRevisionByApiId(apiId string, revisionNo int64) (*model.Revision, error) {
	return store.Revision.Get("Myntra", apiId+"_"+strconv.FormatInt(revisionNo, 10))
}

func GetApiSummary(api *model.Api, selRevision int64) (*model.ApiSummary, error) {
	apiId := api.Id
	s_selRevision := strconv.FormatInt(selRevision, 10)

	revision, err := store.Revision.Get("Myntra", apiId+"_"+s_selRevision)
	if err != nil {
		return nil, errors.New("Revision not found with API id" + apiId)
	}
	groups, err := store.Group.GetByApi("Myntra", apiId, selRevision)
	if err != nil {
		return nil, errors.New("Group not found with API id" + apiId)
	}

	endpoints, err := store.Endpoint.GetByApi("Myntra", apiId, selRevision)
	if err != nil {
		return nil, errors.New("Endpoints not found with API id" + apiId)
	}

	groupBriefs := make([]model.GroupBrief, 0, 0)
	endpointBriefs := make([]model.EndpointBrief, 0, 0)

	for _, group := range groups {
		groupBriefs = append(groupBriefs, model.GroupBrief{
			Id:        group.Id,
			Name:      group.Name,
			Slug:      group.Slug,
			Object:    group.Object,
			Separator: group.Separator,
			Endpoints: group.Endpoints,
		})
	}

	for _, endpoint := range endpoints {
		endpointBriefs = append(endpointBriefs, model.EndpointBrief{
			Id:           endpoint.Id,
			Name:         endpoint.Name,
			GroupId:      endpoint.GroupId,
			Slug:         endpoint.Slug,
			Method:       endpoint.Method,
			Object:       endpoint.Object,
			SubgroupType: endpoint.SubgroupType,
		})
	}

	return &model.ApiSummary{
		ApiId:           apiId,
		Object:          "summary",
		CurrentRevision: api.CurrentRevision,
		GroupIds:        revision.GroupList,
		Groups:          groupBriefs,
		Endpoints:       endpointBriefs,
	}, nil
}
