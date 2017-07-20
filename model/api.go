package model

type Style struct {
	BrandImageUrl                     string `json:"brandImageUrl" bson:"brandImageUrl"`
	BrandImageLink                    string `json:"brandImageLink" bson:"brandImageLink"`
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
}

type Api struct {
	Id                   string `json:"id,omitempty" bson:"_id,omitempty"`
	Name                 string `json:"name" bson:"name" validate:"nonzero"`
	Description          string `json:"description" bson:"description"`
	DescriptionHTML      string `json:"descriptionHTML" bson:"descriptionHTML"`
	Protocol             string `json:"protocol" bson:"protocol" validate:"nonzero"`
	Host                 string `json:"host" bson:"host" validate:"nonzero"`
	Slug                 string `json:"slug,omitempty" bson:"slug,omitempty"`
	Object               string `json:"object",omitempty" bson:"object,omitempty"`
	Version              string `json:"version" bson:"version" validate:"nonzero,regexp=^v[0-9]*$"`
	PublishedRevision    int64  `json:"publishedRevision" bson:"publishedRevision"`
	CurrentRevision      int64  `json:"currentRevision" bson:"currentRevision"`
	UpdatedBy            string `json:"updatedBy" bson:"updatedBy"`
	CreatedBy            string `json:"createdBy" bson:"createdBy"`
	UpdatedAt            int64  `json:"updatedAt" bson:"updatedAt"`
	CreatedAt            int64  `json:"createdAt" bson:"createdAt"`
	AnonymousAccessSlice []int  `json:"-" bson:"anonymousAccessSlice"`
	AnonymousAccess      string `json:"anonymousAccess" bson:"anonymousAccess"`
}

type Revision struct {
	Id          string   `json:"id,omitempty" bson:"_id,omitempty"`
	ApiId       string   `json:"apiId,omitempty" bson:"apiId,omitempty" validate:"nonzero"`
	Object      string   `json:"object,omitempty" bson:"object,omitempty"`
	Number      int64    `json:"number,omitempty" bson:"number,omitempty" validate:"nonzero"`
	GroupList   []string `json:"groupList,omitempty" bson:"groupList,omitempty" validate:"nonzero"`
	CustomStyle *Style   `json:"customStyle,omitempty" bson:"customStyle,omitempty" validate:"nonzero"`
}

type ApiListResponse struct {
	Count      int         `json:"count"`
	Object     string      `json:"object"`
	Data       []Api       `json:"data"`
	Pagination *Pagination `json:"pagination"`
}

type ApiSummary struct {
	ApiId           string          `json:"apiId"`
	Object          string          `json:"object"`
	CurrentRevision int64           `json:"currentRevision" bson:"currentRevision"`
	GroupIds        []string        `json:"groupIds" bson:"groupIds" validate:"nonzero"`
	Groups          []GroupBrief    `json:"groups" bson:"groups" validate:"nonzero"`
	Endpoints       []EndpointBrief `json:"endpoints" bson:"endpoints" validate:"nonzero"`
}

func GetDefaultStyle() *Style {
	return &Style{
		Column:                            3,
		Object:                            "style",
		LinkColor:                         "#11A0E7",
		FontSize:                          14,
		HeaderBackgroundColor:             "#FFFFFF",
		HeaderFontColor:                   "#4C555A",
		SidePanelBackgroundColor:          "#FFFFFF",
		SidePanelFontColor:                "#4C555A",
		SidePanelLightFontColor:           "#9AA4AA",
		SidePanelSecondaryFontColor:       "#F13AB1",
		LeftPanelBackgroundColor:          "#FFFFFF",
		LeftPanelFontColor:                "#4C555A",
		LeftPanelLightFontColor:           "#939DA3",
		LeftPanelHighlightFontColor:       "#11A0E7",
		LeftPanelHighlightBackgroundColor: "#FFFFFF",
		RightPanelBackgroundColor:         "#2B2F3E",
		RightPanelFontColor:               "#939da3",
		CodeFontColor:                     "#88D3A1",
		CodeHighlightColor:                "#9DC158",
		CodeBackgroundColor:               "#272B2D",
		BrandImageUrl:                     "",
		BrandImageLink:                    "",
	}
}
