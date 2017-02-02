import {get, put, post} from 'axios'

export function createEndpoint(data) {
	return put('/madapi/endpoints', data)
}

export function getEndpoint(data) {
	return get('/madapi/endpoints/' + data.endpointId)
}

export function updateEndpoint(data) {
	return post('/madapi/endpoints/' + data.endpointId, data)
}