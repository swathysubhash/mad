package datastore

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"mad/model"
)

type accessStore struct {
	*Datastore
}

func (a *accessStore) EnsureIndex(orgName string) error {
	c := a.DB.C(orgName + "/ACCESSLIST")
	index := mgo.Index{
		Key:    []string{"resourceId", "actorId", "resourceType", "actorType"},
		Unique: true,
	}

	err := c.EnsureIndex(index)
	fmt.Println("Checking index")
	if err != nil {
		return err
	}

	return err
}

func (a *accessStore) Create(orgName string, access *model.Access) error {
	err := a.DB.C(orgName + "/ACCESSLIST").Insert(&access)

	if err != nil {
		return err
	}

	return nil
}

func (a *accessStore) Update(orgName string, access *model.Access) error {
	c := a.DB.C(orgName + "/ACCESSLIST")
	fmt.Println(access)
	err := c.Update(bson.M{
		"resourceId":   access.ResourceId,
		"actorId":      access.ActorId,
		"resourceType": access.ResourceType,
		"actorType":    access.ActorType,
	}, bson.M{"$set": access})
	fmt.Println(err)
	if err != nil {
		return err
	}

	return nil
}

func (a *accessStore) Get(orgName, resourceId, actorId string) (*model.Access, error) {
	var access *model.Access
	c := a.DB.C(orgName + "/ACCESSLIST")
	err := c.Find(bson.M{
		"resourceId": resourceId,
		"actorId":    actorId,
	}).One(&access)

	if err != nil {
		return nil, err
	}
	return access, nil
}

func (a *accessStore) GetAllByResourceId(orgName, resourceId string) (*[]model.Access, error) {
	var accessList = make([]model.Access, 0)
	c := a.DB.C(orgName + "/ACCESSLIST")
	err := c.Find(bson.M{
		"resourceId": resourceId,
	}).All(&accessList)

	if err != nil {
		return nil, err
	}

	return &accessList, nil
}
