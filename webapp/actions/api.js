
import {get, put} from 'axios'

export function getApiList() {
	return (dispatch, getState) => {
		dispatch({ type: 'GETALL_API_REQUEST' })
		get('/madapi/apis').then((err, res) => {
			if (err) {
				dispatch({ type: 'GETALL_API_FAILURE', data: err})
			} else {
				dispatch({ type: 'GETALL_API_RESPONSE', data: res.body})
			}

		})
	}
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

