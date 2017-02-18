package model

type Snippet struct {
	Lang   string `json:"lang" bson:"lang" validate:"nonzero"`
	Code   string `json:"code" bson:"code" validate:"nonzero"`
	Object string `json:"object",omitempty" bson:"object,omitempty" validate:"nonzero"`
}

type Endpoint struct {
	Id               string                 `json:"id,omitempty" bson:"_id,omitempty"`
	EId              string                 `json:"eid,omitempty" bson:"eid,omitempty"`
	Name             string                 `json:"name" bson:"name" validate:"nonzero"`
	Slug             string                 `json:"slug" bson:"slug" validate:"nonzero"`
	Object           string                 `json:"object",omitempty" bson:"object,omitempty"`
	Description      string                 `json:"description" bson:"description"`
	DescriptionHTML  string                 `json:"descriptionHTML" bson:"descriptionHTML"`
	ApiId            string                 `json:"apiId" bson:"apiId" validate:"nonzero"`
	GroupId          string                 `json:"groupId" bson:"groupId" validate:"nonzero"`
	Revision         int64                  `json:"revision" bson:"revision"`
	SubgroupType     string                 `json:"subgroupType" bson:"subgroupType"`
	Schema           string                 `json:"schema" bson:"schema"`
	SchemaMap        map[string]interface{} `json:"-" bson:"-"`
	Url              string                 `json:"url" bson:"url"`
	Method           string                 `json:"method" bson:"method"`
	QueryParameters  []Parameter            `json:"queryParameters,omitempty" bson:"queryParameters"`
	UrlParameters    []Parameter            `json:"urlParameters,omitempty" bson:"urlParameters"`
	RequestHeaders   []Header               `json:"requestHeaders,omitempty" bson:"requestHeaders"`
	RequestBody      *string                `json:"requestBody" bson:"requestBody"`
	ResponseHeaders  []Header               `json:"responseHeaders,omitempty" bson:"responseHeaders"`
	ResponseBody     *string                `json:"responseBody" bson:"responseBody"`
	LanguageSnippets []Snippet              `json:"languageSnippets, omitempty" bson:"languageSnippets"`
	UpdatedBy        string                 `json:"updatedBy" bson:"updatedBy"`
	CreatedBy        string                 `json:"createdBy" bson:"createdBy"`
	UpdatedAt        int64                  `json:"updatedAt" bson:"updatedAt"`
	CreatedAt        int64                  `json:"createdAt" bson:"createdAt"`
}

type EndpointBrief struct {
	Id           string `json:"id,omitempty" bson:"_id,omitempty"`
	Name         string `json:"name" bson:"name" validate:"nonzero"`
	Slug         string `json:"slug" bson:"slug" validate:"nonzero"`
	GroupId      string `json:"groupId" bson:"groupId" validate:"nonzero"`
	Object       string `json:"object",omitempty" bson:"object,omitempty"`
	Method       string `json:"method" bson:"method" validate:"nonzero"`
	SubgroupType string `json:"subgroupType" bson:"subgroupType"`
}

type Parameter struct {
	Name            string `json:"name" bson:"name" validate:"nonzero"`
	Object          string `json:"object",omitempty" bson:"object,omitempty" validate:"nonzero"`
	Description     string `json:"description" bson:"description" validate:"nonzero"`
	DescriptionHTML string `json:"descriptionHTML" bson:"descriptionHTML" validate:"nonzero"`
	DefaultValue    string `json:"defaultValue,omitempty" bson:"defaultValue"`
	Required        bool   `json:"required,omitempty" bson:"required"`
}

type Header struct {
	Name   string `json:"name" bson:"name" validate:"nonzero"`
	Value  string `json:"value" bson:"value" validate:"nonzero"`
	Object string `json:"object",omitempty" bson:"object,omitempty"`
}

type Body struct {
	Example string `json:"example,omitempty" bson:"example"`
	Object  string `json:"object",omitempty" bson:"object,omitempty"`
}

type EndpointListResponse struct {
	Count  int        `json:"count"`
	Object string     `json:"object"`
	Data   []Endpoint `json:"data"`
}
