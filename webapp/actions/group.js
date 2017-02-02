
import {get, put, post} from 'axios'

export function createGroup(data) {
	return put('/madapi/groups', data)
}

export function getGroup(data) {
	return get('/madapi/groups/' + data.groupId)
}

export function updateGroup(data) {
	return post('/madapi/groups/' + data.groupId, data)
}