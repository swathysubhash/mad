import axios from '../vendor/axios'

const get = axios.get
const post = axios.post
const put = axios.put

export function getStyle(data) {
	return get('/madapi/apis/' + data.documentId  + '/style')
}

export function updateStyle(data) {
	return post('/madapi/apis/' + data.documentId  + '/style', data)
}