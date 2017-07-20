package datastore

import (
	"fmt"
	"github.com/swathysubhash/mad/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"strconv"
	"time"
)

type apiStore struct {
	*Datastore
}

func (a *apiStore) EnsureIndex(orgName string) error {
	c := a.DB.C(orgName + "/APILIST")
	index := mgo.Index{
		Key:    []string{"slug"},
		Unique: true,
	}

	err := c.EnsureIndex(index)

	if err != nil {
		return err
	}

	index = mgo.Index{
		Key: []string{"createdBy", "_id"},
	}

	err = c.EnsureIndex(index)

	if err != nil {
		return err
	}

	return err
}

func (a *apiStore) Create(orgName string, api *model.Api) error {
	// c := a.DB.C(orgName + "/TRANSACTIONLIST")

	revisionId := api.Id + "_" + strconv.FormatInt(api.CurrentRevision, 10)
	revision := model.Revision{
		Id:          revisionId,
		ApiId:       api.Id,
		Object:      "revision",
		Number:      api.CurrentRevision,
		GroupList:   []string{},
		CustomStyle: model.GetDefaultStyle(),
	}

	err := a.DB.C(orgName + "/REVISIONLIST").Insert(revision)

	if err != nil {
		return err
	}

	now := time.Now().Unix()
	err = a.DB.C(orgName + "/ACCESSLIST").Insert(&model.Access{
		Object:          "access",
		ResourceId:      api.Id,
		ResourceType:    "api",
		ActorId:         api.CreatedBy,
		ActorType:       "user",
		PermissionSlice: []int{1, 1, 1},
		Permission:      "admin",
		UpdatedBy:       api.CreatedBy,
		UpdatedAt:       now,
		CreatedBy:       api.CreatedBy,
		CreatedAt:       now,
	})

	if err != nil {
		return err
	}

	err = a.DB.C(orgName + "/APILIST").Insert(&api)

	if err != nil {
		return err
	}

	return nil
}

func (a *apiStore) Get(orgName, apiId string) (*model.Api, error) {
	var api *model.Api
	c := a.DB.C(orgName + "/APILIST")
	err := c.Find(bson.M{"_id": apiId}).One(&api)

	if err != nil {
		return nil, err
	}

	return api, nil
}

func (a *apiStore) GetBySlug(orgName, slug string) (*model.Api, error) {
	var api *model.Api
	c := a.DB.C(orgName + "/APILIST")
	err := c.Find(bson.M{"slug": slug}).One(&api)

	if err != nil {
		return nil, err
	}

	return api, nil
}

func (a *apiStore) GetAll(orgName, gt, lt string, limit int, user string) ([]model.Api, error) {
	var apiList = make([]model.Api, 0)

	c := a.DB.C(orgName + "/APILIST")
	var err error
	if len(user) > 0 {
		if len(lt) > 0 {
			err = c.Find(bson.M{"createdBy": user, "_id": bson.M{"$lt": lt}}).Sort("-_id").Limit(limit).All(&apiList)
		} else {
			err = c.Find(bson.M{"createdBy": user, "_id": bson.M{"$gt": gt}}).Sort("-_id").Limit(limit).All(&apiList)
		}
	} else {
		if len(lt) > 0 {
			err = c.Find(bson.M{"_id": bson.M{"$lt": lt}}).Sort("-_id").Limit(limit).All(&apiList)
		} else {
			err = c.Find(bson.M{"_id": bson.M{"$gt": gt}}).Sort("-_id").Limit(limit).All(&apiList)
		}
	}

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return apiList, nil
}

func (a *apiStore) Update(orgName, apiId string, api *model.Api) error {
	c := a.DB.C(orgName + "/APILIST")

	err := c.Update(bson.M{"_id": apiId}, bson.M{"$set": api})

	if err != nil {
		return err
	}

	return nil
}

func (a *apiStore) Remove(orgName, apiId string) error {
	c := a.DB.C(orgName + "/APILIST")

	err := c.Remove(bson.M{"_id": apiId})

	if err != nil {
		return err
	}

	return nil
}

func (a *apiStore) updateTime(orgName, apiId string) error {
	c := a.DB.C(orgName + "/APILIST")

	err := c.Update(bson.M{"_id": apiId}, bson.M{"$set": bson.M{"updatedAt": time.Now().Unix()}})

	if err != nil {
		return err
	}
	return nil
}
