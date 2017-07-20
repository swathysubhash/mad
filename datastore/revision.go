package datastore

import (
	"fmt"
	"github.com/swathysubhash/mad/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type revisionStore struct {
	*Datastore
}

func (r *revisionStore) EnsureIndex(orgName string) error {
	c := r.DB.C(orgName + "/APILIST")
	index := mgo.Index{
		Key:    []string{"slug"},
		Unique: true,
	}

	err := c.EnsureIndex(index)

	if err != nil {
		return err
	}

	return err
}

func (r *revisionStore) Create(orgName string, revision *model.Revision) error {
	err := r.DB.C(orgName + "/REVISIONLIST").Insert(&revision)

	if err != nil {
		return err
	}

	return nil
}

func (r *revisionStore) Upsert(orgName string, revision *model.Revision) error {
	fmt.Println("test")
	_, err := r.DB.C(orgName+"/REVISIONLIST").Upsert(bson.M{"_id": revision.Id}, bson.M{"$set": revision})

	if err != nil {
		return err
	}

	return nil
}

func (r *revisionStore) Get(orgName, revisionId string) (*model.Revision, error) {
	var revision *model.Revision
	c := r.DB.C(orgName + "/REVISIONLIST")
	err := c.Find(bson.M{"_id": revisionId}).One(&revision)

	if err != nil {
		return nil, err
	}

	return revision, nil
}

func (r *revisionStore) RemoveGroup(orgName, revisionId, groupId string) error {
	c := r.DB.C(orgName + "/REVISIONLIST")

	err := c.Update(bson.M{"_id": revisionId}, bson.M{"$pull": bson.M{"groupList": groupId}})

	if err != nil {
		return err
	}

	return nil
}
