package datastore

import (
	"gopkg.in/mgo.v2"
	// "gopkg.in/mgo.v2/bson"
	"fmt"
	"log"
	"sync"
)

var connectOnce sync.Once
var mongo *mgo.Session
var DB *mgo.Database

func Connect() {
	connectOnce.Do(func() {
		//set DB credentials
		var err error
		mongo, err = mgo.Dial("localhost")
		if err != nil {
			log.Fatal("Error connecting to mongo db", err)
		}

		DB = mongo.DB("madwriter")
		fmt.Println("DB -- > ", DB)
	})
}
