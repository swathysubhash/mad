package datastore

import (
	"gopkg.in/mgo.v2"
	"log"
)

type Datastore struct {
	Group    *groupStore
	Endpoint *endpointStore
	Api      *apiStore
	DB       *mgo.Database
}

func NewDatastore(db *mgo.Database) *Datastore {
	if db == nil {
		Connect()
		db = DB
	}

	datastore := &Datastore{DB: db}
	datastore.Group = &groupStore{datastore}
	datastore.Endpoint = &endpointStore{datastore}
	datastore.Api = &apiStore{datastore}

	err := datastore.Api.EnsureIndex("Myntra")

	if err != nil {
		log.Fatal(err)
	}

	err = datastore.Group.EnsureIndex("Myntra")

	if err != nil {
		log.Fatal(err)
	}

	err = datastore.Endpoint.EnsureIndex("Myntra")

	if err != nil {
		log.Fatal(err)
	}

	return datastore
}
