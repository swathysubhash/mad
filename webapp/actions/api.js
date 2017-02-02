
import {get, put} from 'axios'

export function getApiList() {
	return get('/madapi/apis')
}

export function getApi(data) {
	return get('/madapi/apis/' + data.apiId)
}

export function getApiSummary(data) {
	return get('/madapi/apis/' + data.apiId + '/summary')
}
// export function createApi() {
// 	return (dispatch, getState) => {
// 		console.log("inside dispatch")
// 		dispatch({ type: 'CREATE_API_REQUEST' })
// 		put('/madapi/apis/all', data).then((err, res) => {
// 			if (err) {
// 				dispatch({ type: 'CREATE_API_FAILURE', data: err})
// 			} else {
// 				dispatch({ type: 'CREATE_API_SUCCESS', data: res.body})
// 			}			
// 		})
// 	}
// }


export function createApi(data) {
	return put('/madapi/apis', data)
}

