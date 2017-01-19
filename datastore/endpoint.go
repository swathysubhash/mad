package datastore

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"mad/model"
)

type endpointStore struct {
	*Datastore
}

func (e *endpointStore) EnsureIndex(orgName string) error {
	index := mgo.Index{
		Key:    []string{"groupId", "revision", "name"},
		Unique: true,
	}
	err := e.DB.C(orgName + "/ENDPOINTLIST").EnsureIndex(index)

	if err != nil {
		return err
	}

	return err
}

func (e *endpointStore) Create(orgName string, endpoint *model.Endpoint) error {

	err := e.DB.C(orgName+"/GROUPLIST").Update(bson.M{"_id": endpoint.GroupId, "revision": endpoint.Revision},
		bson.M{"$push": bson.M{"endpoints": endpoint.Id}})

	if err != nil {
		return err
	}

	err = e.DB.C(orgName + "/ENDPOINTLIST").Insert(&endpoint)

	if err != nil {
		return err
	}

	return nil
}

func (e *endpointStore) GetAll(orgName, groupId string, revision int64) (*[]model.Endpoint, error) {
	var endpointList = make([]model.Endpoint, 0)

	c := e.DB.C(orgName + "/ENDPOINTLIST")
	fmt.Println("groupId", groupId, "revision", revision)
	err := c.Find(bson.M{"groupId": groupId, "revision": revision}).All(&endpointList)
	if err != nil {
		return nil, err
	}

	return &endpointList, nil
}

func (e *endpointStore) Get(orgName, groupId string, revision int64, endpointId string) (*model.Endpoint, error) {
	var endpoint *model.Endpoint
	c := e.DB.C(orgName + "/ENDPOINTLIST")
	err := c.Find(bson.M{"_id": endpointId, "groupId": groupId, "revision": revision}).One(&endpoint)

	if err != nil {
		return nil, err
	}

	return endpoint, nil
}

func (e *endpointStore) Update(orgName, groupId string, revision int64, endpointId string, endpoint *model.Endpoint) error {
	c := e.DB.C(orgName + "/ENDPOINTLIST")

	err := c.Update(bson.M{"_id": endpointId, "groupId": groupId, "revision": revision}, bson.M{"$set": endpoint})

	if err != nil {
		return err
	}

	return nil
}
