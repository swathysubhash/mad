package model

type Group struct {
	Id          string    `json:"id,omitempty" bson:"_id,omitempty"`
	ApiId       string    `json:"apiId" bson:"apiId" validate:"nonzero"`
	Object      string    `json:"object",omitempty" bson:"object,omitempty"`
	Revision    int64     `json:"revision" bson:"revision"`
	Name        string    `json:"name" bson:"name" validate:"nonzero"`
	Description string    `json:"description" bson:"description"`
	Separator   bool      `json:"separator" bson:"separator"`
	Endpoints   *[]string `json:"endpoints" bson:"endpoints"`
}

type GroupListResponse struct {
	Count  int      `json:"count"`
	Object string   `json:"object"`
	Data   *[]Group `json:"data"`
}
