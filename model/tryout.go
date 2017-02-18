package model

type SectionResponse struct {
	HtmlString  string           `json:"htmlString"`
	SectionData *SectionEndpoint `json:"sectionData"`
}

type SectionEndpoint struct {
	Id              string      `json:"id"`
	Method          string      `json:"method"`
	Url             string      `json:"url"`
	QueryParameters []Parameter `json:"queryParameters"`
	UrlParameters   []Parameter `json:"urlParameters"`
	RequestHeaders  []Header    `json:"requestHeaders"`
}

type TryoutRequest struct {
	Host           string   `json:"hostName"`
	Url            string   `json:"url"`
	Protocol       string   `json:"protocol"`
	Method         string   `json:"method"`
	RequestHeaders []Header `json:"requestHeaders"`
	RequestBody    string   `json:"requestBody"`
}

type TryoutResponse struct {
	Error      string `json:"error"`
	StatusCode int    `json:"statusCode"`
	Status     string `json:"status"`
	Data       string `json:"data"`
}
