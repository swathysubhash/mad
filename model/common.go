package model

type ErrorResponse struct {
	Object  string `json:"object"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

type SuccessResponse struct {
	Object  string `json:"object"`
	Message string `json:"message"`
}
