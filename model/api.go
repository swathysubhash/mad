package model

type Style struct {
	Column                            int    `json:"column" bson:"column"`
	Object                            string `json:"object",omitempty" bson:"object,omitempty"`
	LinkColor                         string `json:"linkColor" bson:"linkColor"`
	FontSize                          int    `json:"fontSize" bson:"fontSize"`
	HeaderBackgroundColor             string `json:"headerBackgroundColor" bson:"headerBackgroundColor"`
	HeaderFontColor                   string `json:"headerFontColor" bson:"headerFontColor"`
	SidePanelBackgroundColor          string `json:"sidePanelBackgroundColor" bson:"sidePanelBackgroundColor"`
	SidePanelFontColor                string `json:"sidePanelFontColor" bson:"sidePanelFontColor"`
	SidePanelLightFontColor           string `json:"sidePanelLightFontColor" bson:"sidePanelLightFontColor"`
	SidePanelSecondaryFontColor       string `json:"sidePanelSecondaryFontColor" bson:"sidePanelSecondaryFontColor"`
	LeftPanelBackgroundColor          string `json:"leftPanelBackgroundColor" bson:"leftPanelBackgroundColor"`
	LeftPanelFontColor                string `json:"leftPanelFontColor" bson:"leftPanelFontColor"`
	LeftPanelLightFontColor           string `json:"leftPanelLightFontColor" bson:"leftPanelLightFontColor"`
	LeftPanelHighlightFontColor       string `json:"leftPanelHighlightFontColor" bson:"leftPanelHighlightFontColor"`
	LeftPanelHighlightBackgroundColor string `json:"leftPanelHighlightBackgroundColor" bson:"leftPanelHighlightBackgroundColor"`
	RightPanelBackgroundColor         string `json:"rightPanelBackgroundColor" bson:"rightPanelBackgroundColor"`
	RightPanelFontColor               string `json:"rightPanelFontColor" bson:"rightPanelFontColor"`
	CodeFontColor                     string `json:"codeFontColor" bson:"codeFontColor"`
	CodeHighlightColor                string `json:"codeHighlightColor" bson:"codeHighlightColor"`
	CodeBackgroundColor               string `json:"codeBackgroundColor" bson:"codeBackgroundColor"`
	OrgNameFontColor                  string `json:"orgNameFontColor" bson:"orgNameFontColor"`
	OrgApiStringFontColor             string `json:"orgApiStringFontColor" bson:"orgApiStringFontColor"`
}

type Api struct {
	Id                string `json:"id,omitempty" bson:"_id,omitempty"`
	Name              string `json:"name" bson:"name" validate:"nonzero"`
	Description       string `json:"description" bson:"description"`
	Protocol          string `json:"protocol" bson:"protocol" validate:"nonzero"`
	Host              string `json:"host" bson:"host" validate:"nonzero"`
	Slug              string `json:"slug,omitempty" bson:"slug,omitempty"`
	Object            string `json:"object",omitempty" bson:"object,omitempty"`
	Version           string `json:"version" bson:"version" validate:"nonzero,regexp=^v[0-9]*$"`
	PublishedRevision int64  `json:"publishedRevision" bson:"publishedRevision"`
	CurrentRevision   int64  `json:"currentRevision" bson:"currentRevision"`
	// AvailableRevisions *[]Revision `json:"availableRevisions" bson:"availableRevisions"`
}

type Revision struct {
	Id          string   `json:"id,omitempty" bson:"_id,omitempty"`
	ApiId       string   `json:"apiId" bson:"apiId" validate:"nonzero"`
	Object      string   `json:"object",omitempty" bson:"object,omitempty"`
	Number      int64    `json:"number" bson:"number" validate:"nonzero"`
	GroupList   []string `json:"groupList" bson:"groupList" validate:"nonzero"`
	CustomStyle *Style   `json:"customStyle,omitempty" bson:"customStyle,omitempty" validate:"nonzero"`
}

type ApiListResponse struct {
	Count  int    `json:"count"`
	Object string `json:"object"`
	Data   *[]Api `json:"data"`
}
