import axios from '../vendor/axios'

const get = axios.get
const post = axios.post
const put = axios.put

export function createEndpoint(data) {
	return put('/madapi/endpoints', data)
}

export function getEndpoint(data) {
	return get('/madapi/endpoints/' + data.endpointId)
}

export function updateEndpoint(data) {
	return post('/madapi/endpoints/' + data.id, data)
}