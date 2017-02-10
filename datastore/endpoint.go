package datastore

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"mad/model"
)

type endpointStore struct {
	*Datastore
}

func (e *endpointStore) EnsureIndex(orgName string) error {
	index := mgo.Index{
		Key: []string{"groupId", "revision", "subgroupType"},
	}
	err := e.DB.C(orgName + "/ENDPOINTLIST").EnsureIndex(index)

	if err != nil {
		return err
	}
	index = mgo.Index{
		Key: []string{"apiId", "revision", "subgroupType"},
	}
	err = e.DB.C(orgName + "/ENDPOINTLIST").EnsureIndex(index)

	if err != nil {
		return err
	}

	return err
}

func (e *endpointStore) Create(orgName string, endpoint *model.Endpoint) error {

	err := e.DB.C(orgName+"/GROUPLIST").Update(bson.M{
		"_id": endpoint.GroupId,
	},
		bson.M{
			"$push": bson.M{
				"endpoints": endpoint.Id,
			},
		},
	)

	if err != nil {
		return err
	}

	err = e.DB.C(orgName + "/ENDPOINTLIST").Insert(&endpoint)

	if err != nil {
		return err
	}

	return nil
}

func (e *endpointStore) GetAll(orgName, groupId string) (*[]model.Endpoint, error) {
	var endpointList = make([]model.Endpoint, 0)

	c := e.DB.C(orgName + "/ENDPOINTLIST")
	err := c.Find(bson.M{"groupId": groupId}).All(&endpointList)
	if err != nil {
		return nil, err
	}

	return &endpointList, nil
}

func (e *endpointStore) GetByApi(orgName, apiId string, revision int64) (*[]model.Endpoint, error) {
	var endpointList = make([]model.Endpoint, 0)

	c := e.DB.C(orgName + "/ENDPOINTLIST")
	err := c.Find(bson.M{"apiId": apiId, "revision": revision}).All(&endpointList)
	if err != nil {
		return nil, err
	}

	return &endpointList, nil
}

func (e *endpointStore) Get(orgName, endpointId string) (*model.Endpoint, error) {
	var endpoint *model.Endpoint
	c := e.DB.C(orgName + "/ENDPOINTLIST")
	err := c.Find(bson.M{"_id": endpointId}).One(&endpoint)

	if err != nil {
		return nil, err
	}

	return endpoint, nil
}

func (e *endpointStore) Update(orgName, endpointId string, endpoint *model.Endpoint) error {
	c := e.DB.C(orgName + "/ENDPOINTLIST")

	err := c.Update(bson.M{"_id": endpointId}, bson.M{"$set": endpoint})

	if err != nil {
		return err
	}

	return nil
}

func (e *endpointStore) UpsertMany(orgName string, endpoints *[]model.Endpoint) error {
	c := e.DB.C(orgName + "/ENDPOINTLIST")

	for _, e := range *endpoints {

		_, err := c.Upsert(bson.M{"_id": e.Id}, e)
		if err != nil {
			return err
		}
	}

	return nil
}
