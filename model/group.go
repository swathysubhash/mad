package model

type Group struct {
	Id              string    `json:"id,omitempty" bson:"_id,omitempty"`
	GId             string    `json:"gid,omitempty" bson:"gid,omitempty"`
	ApiId           string    `json:"apiId" bson:"apiId" validate:"nonzero"`
	Slug            string    `json:"slug" bson:"slug" validate:"nonzero"`
	Object          string    `json:"object",omitempty" bson:"object,omitempty"`
	Revision        int64     `json:"revision" bson:"revision"`
	Name            string    `json:"name" bson:"name" validate:"nonzero"`
	Description     string    `json:"description" bson:"description"`
	DescriptionHTML string    `json:"descriptionHTML" bson:"descriptionHTML"`
	Separator       bool      `json:"separator" bson:"separator"`
	Endpoints       *[]string `json:"endpoints" bson:"endpoints"`
	UpdatedBy       string    `json:"updatedBy" bson:"updatedBy"`
	CreatedBy       string    `json:"createdBy" bson:"createdBy"`
	UpdatedAt       int64     `json:"updatedAt" bson:"updatedAt"`
	CreatedAt       int64     `json:"createdAt" bson:"createdAt"`
}

type GroupBrief struct {
	Id        string    `json:"id,omitempty" bson:"_id,omitempty"`
	Object    string    `json:"object",omitempty" bson:"object,omitempty"`
	Slug      string    `json:"slug" bson:"slug" validate:"nonzero"`
	Name      string    `json:"name" bson:"name" validate:"nonzero"`
	Separator bool      `json:"separator" bson:"separator"`
	Endpoints *[]string `json:"endpoints" bson:"endpoints"`
}

type GroupListResponse struct {
	Count  int      `json:"count"`
	Object string   `json:"object"`
	Data   *[]Group `json:"data"`
}
