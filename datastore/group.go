package datastore

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"mad/model"
	"strconv"
)

type groupStore struct {
	*Datastore
}

func (g *groupStore) EnsureIndex(orgName string) error {
	fmt.Println("")
	index := mgo.Index{
		Key:    []string{"apiId", "revision", "name"},
		Unique: true,
	}
	err := g.DB.C(orgName + "/GROUPLIST").EnsureIndex(index)

	if err != nil {
		return err
	}

	return err
}

func (g *groupStore) Create(orgName string, group *model.Group) error {
	revisionId := group.ApiId + "_" + strconv.FormatInt(group.Revision, 10)
	err := g.DB.C(orgName+"/REVISIONLIST").Update(bson.M{
		"_id": revisionId,
	}, bson.M{
		"$push": bson.M{
			"groupList": group.Id,
		},
	})

	if err != nil {
		return err
	}

	err = g.DB.C(orgName + "/GROUPLIST").Insert(&group)

	if err != nil {
		return err
	}

	return nil
}

func (g *groupStore) GetAll(orgName, apiId string, revision int64) ([]model.Group, error) {
	var groupList = make([]model.Group, 0)

	c := g.DB.C(orgName + "/GROUPLIST")
	err := c.Find(bson.M{"apiId": apiId, "revision": revision}).All(&groupList)
	if err != nil {
		return nil, err
	}

	return groupList, nil
}

func (g *groupStore) Get(orgName, groupId string) (*model.Group, error) {
	var group *model.Group
	c := g.DB.C(orgName + "/GROUPLIST")
	err := c.Find(bson.M{"_id": groupId}).One(&group)

	if err != nil {
		return nil, err
	}

	return group, nil
}

func (g *groupStore) GetByApi(orgName, apiId string, revision int64) ([]model.Group, error) {
	var groupList = make([]model.Group, 0)

	c := g.DB.C(orgName + "/GROUPLIST")
	err := c.Find(bson.M{"apiId": apiId, "revision": revision}).All(&groupList)

	if err != nil {
		return nil, err
	}

	return groupList, nil
}

func (g *groupStore) Update(orgName, groupId string, group *model.Group) error {
	c := g.DB.C(orgName + "/GROUPLIST")

	err := c.Update(bson.M{"_id": groupId}, bson.M{"$set": group})

	if err != nil {
		return err
	}

	return nil
}

func (g *groupStore) UpsertMany(orgName string, groups []model.Group) error {
	c := g.DB.C(orgName + "/GROUPLIST")

	for _, g := range groups {
		_, err := c.Upsert(bson.M{"_id": g.Id}, g)
		if err != nil {
			return err
		}
	}

	return nil
}
