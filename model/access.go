package model

type Access struct {
	Object          string `json:"object,omitempty" bson:"object,omitempty"`
	ResourceId      string `json:"resourceId,omitempty" bson:"resourceId,omitempty"`
	ResourceType    string `json:"resourceType,omitempty" bson:"resourceType,omitempty"`
	ActorId         string `json:"actorId,omitempty" bson:"actorId,omitempty"`
	ActorType       string `json:"actorType,omitempty" bson:"actorType,omitempty"`
	PermissionSlice []int  `json:"-" bson:"permissionSlice,omitempty"`
	Permission      string `json:"permission,omitempty" bson:"permission,omitempty"`
	UpdatedBy       string `json:"updatedBy" bson:"updatedBy"`
	CreatedBy       string `json:"createdBy" bson:"createdBy"`
	UpdatedAt       int64  `json:"updatedAt" bson:"updatedAt"`
	CreatedAt       int64  `json:"createdAt" bson:"createdAt"`
}

type AccessListResponse struct {
	Count  int       `json:"count"`
	Object string    `json:"object"`
	Data   *[]Access `json:"data"`
}

type AccessResponse struct {
	Access bool `json:"access"`
}

// Index : - ResourceId, ActorId, ResourceType, ActorType
// Permission
// 1 - read 100 1
// 2 - read and write 110  2
// 3 - read write and admin 111  3
