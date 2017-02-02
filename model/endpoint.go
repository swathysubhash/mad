package model

type Snippet struct {
	Lang   string `json:"lang" bson:"lang" validate:"nonzero"`
	Code   string `json:"code" bson:"code" validate:"nonzero"`
	Object string `json:"object",omitempty" bson:"object,omitempty" validate:"nonzero"`
}

type Endpoint struct {
	Id               string       `json:"id,omitempty" bson:"_id,omitempty"`
	EId              string       `json:"eid,omitempty" bson:"eid,omitempty"`
	Name             string       `json:"name" bson:"name" validate:"nonzero"`
	Object           string       `json:"object",omitempty" bson:"object,omitempty"`
	Description      string       `json:"description" bson:"description" validate:"nonzero"`
	ApiId            string       `json:"apiId" bson:"apiId" validate:"nonzero"`
	GroupId          string       `json:"groupId" bson:"groupId" validate:"nonzero"`
	Revision         int64        `json:"revision" bson:"revision"`
	Url              string       `json:"url" bson:"url" validate:"nonzero"`
	Method           string       `json:"method" bson:"method" validate:"nonzero"`
	QueryParameters  []*Parameter `json:"queryParameters,omitempty" bson:"queryParameters"`
	UrlParameters    []*Parameter `json:"urlParameters,omitempty" bson:"urlParameters"`
	RequestHeaders   []*Header    `json:"requestHeaders,omitempty" bson:"requestHeaders"`
	RequestBody      Body         `json:"requestBody,omitempty" bson:"requestBody"`
	ResponseHeaders  []*Header    `json:"requestHeaders,omitempty" bson:"responseHeaders"`
	ResponseBody     Body         `json:"requestBody,omitempty" bson:"responseBody"`
	LanguageSnippets []*Snippet   `json:"languageSnippets, omitempty" bson:"languageSnippets"`
}

type EndpointBrief struct {
	Id      string `json:"id,omitempty" bson:"_id,omitempty"`
	Name    string `json:"name" bson:"name" validate:"nonzero"`
	GroupId string `json:"groupId" bson:"groupId" validate:"nonzero"`
	Object  string `json:"object",omitempty" bson:"object,omitempty"`
	Method  string `json:"method" bson:"method" validate:"nonzero"`
}

type Parameter struct {
	Name         string `json:"name" bson:"name" validate:"nonzero"`
	Object       string `json:"object",omitempty" bson:"object,omitempty" validate:"nonzero"`
	Value        string `json:"value" bson:"value" validate:"nonzero"`
	DataType     string `json:"dataType" bson:"dataType"`
	Minimum      string `json:"minimum,omitempty" bson:"minimum"`
	Maximum      string `json:"maximum,omitempty" bson:"maximum"`
	DefaultValue string `json:"defaultValue,omitempty" bson:"defaultValue"`
	Required     bool   `json:"required,omitempty" bson:"required"`
}

type Header struct {
	Name     string `json:"name" bson:"name" validate:"nonzero"`
	Object   string `json:"object",omitempty" bson:"object,omitempty"`
	Value    string `json:"value" bson:"value" validate:"nonzero"`
	DataType string `json:"dataType,omitempty" bson:"dataType"`
	Example  string `json:"example,omitempty" bson:"example"`
}

type Body struct {
	Example string `json:"example,omitempty" bson:"example"`
	Object  string `json:"object",omitempty" bson:"object,omitempty"`
}

type EndpointListResponse struct {
	Count  int         `json:"count"`
	Object string      `json:"object"`
	Data   *[]Endpoint `json:"data"`
}
