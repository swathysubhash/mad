import { combineReducers } from 'redux'
const initialState = {
		apis: {
			byIds: {}
		},
		groups: {
			byIds: {}
		},
		endpoints: {
			byIds: {}
		},
		ui: {
			apiSummary: {
				loading: false
			}
		}
}

export default function entities(state = initialState, action) {
  console.log('STATE', state, "ACTION", action)
  let data = action.data
  switch (action.type) {
  	case 'CREATE_API_SUCCESS': 
  		break;
  	case 'GET_APILIST_SUCCESS':
  		return {
  			...state,
  			apis: apisReducer(state.apis, {type: 'ADD_APIS', data: data}),
  		}
    case 'GET_ACCESS_RESPONSE':
      return {
        ...state,
        apis: apisReducer(state.apis, {type: 'ADD_ACCESS', data: data}),
      }
    case 'UPDATE_ACCESS_RESPONSE':
      return {
        ...state,
        apis: apisReducer(state.apis, {type: 'UPDATE_ACCESS', data: data}),
      }
    case 'CREATE_ACCESS_RESPONSE':
      return {
        ...state,
        apis: apisReducer(state.apis, {type: 'CREATE_ACCESS', data: data}),
      }
  	case 'GET_API_REQUEST': 
  		return state
  	case 'GET_API_RESPONSE':
  		return {
  			...state,
  			apis: apisReducer(state.apis, {type: 'ADD_API', data: data})
  		}
    case 'UPDATE_API_RESPONSE':
      return {
        ...state,
        apis: apisReducer(state.apis, {type: 'ADD_API', data: data})
      }
  	case 'GET_APISUMMARY_REQUEST': 
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'START_LOADING'})
  		}
  	case 'GET_APISUMMARY_RESPONSE':
  		return {
  			...state,
  			apis: apisReducer(state.apis, {type: 'UPDATE_API', data: data}),
  			groups: groupsReducer(state.groups, {type: 'ADD_GROUPS', data: data}),
  			endpoints : endpointsReducer(state.endpoints, {type: 'ADD_ENDPOINTS', data: data}),
  			ui: uiReducer(state.ui, {type: 'STOP_LOADING'})
  		}
		case 'GET_APISUMMARY_SUCCESS': 
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'STOP_LOADING'})
  		}		
    case 'RESET_API_SUMMARY':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'FETCH_DATA'}),
      }
  	case 'CREATE_GROUP_RESPONSE':
  		return {
  			...state,
        ui: uiReducer(state.ui, {type: 'FETCH_DATA'}),
  			groups: groupsReducer(state.groups, {type: 'ADD_GROUP', data: data})
  		}
  	case 'UPDATE_GROUP_RESPONSE':
  		return {
  			...state,
  			groups: groupsReducer(state.groups, {type: 'ADD_GROUP', data: data})
  		}
  	case 'GET_GROUP_RESPONSE':
  		return {
  			...state,
  			groups: groupsReducer(state.groups, {type: 'ADD_GROUP', data: data})
  		}
  	case 'CREATE_ENDPOINT_RESPONSE':
  		return {
  			...state,
        ui: uiReducer(state.ui, {type: 'FETCH_DATA'}),
  			endpoints: endpointsReducer(state.endpoints, {type: 'ADD_ENDPOINT', data: data})
  		}
  	case 'UPDATE_ENDPOINT_RESPONSE':
  		return {
  			...state,
  			endpoints: endpointsReducer(state.endpoints, {type: 'ADD_ENDPOINT', data: data})
  		}
  	case 'GET_ENDPOINT_RESPONSE':
  		return {
  			...state,
  			endpoints: endpointsReducer(state.endpoints, {type: 'ADD_ENDPOINT', data: data})
  		}
  	case 'GROUP_SELECT':
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'GROUP_SELECT', data: data})
  		}
  	case 'GROUP_CREATE':
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'GROUP_CREATE'})
  		}
  	case 'ENDPOINT_SELECT':
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'ENDPOINT_SELECT', data: data})
  		}
  	case 'ENDPOINT_CREATE':
  		return {
  			...state,
  			ui: uiReducer(state.ui, {type: 'ENDPOINT_CREATE', data: data })
  		}
    case 'SCHEMA_CREATE':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'SCHEMA_CREATE', data: data })
      }
    case 'TEXTDOCUMENT_CREATE':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'TEXTDOCUMENT_CREATE', data: data })
      }
    case 'SET_NOTIFICATION':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'SET_NOTIFICATION', data: data})
      }
    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'DISMISS_NOTIFICATION', data: data})
      }
    case 'API_READ_PERMISSION_FAIL':
      return {
        ...state,
        ui: uiReducer(state.ui, {type: 'DISMISS_NOTIFICATION', data: data})
      }
  	default:
      return state
  }
}



function apisById(state = {}, action) {
	 	let data = action.data
    switch(action.type) {
        case 'UPDATE_API' :
	        return { 
	        	...state,
	        	[data.apiId] : {
	        		...state[data.apiId], 
	        		...{ id: data.apiId, groupIds: data.groupIds, currentRevision: data.currentRevision }
	        	}
	        }
	      case 'ADD_APIS' :
	      	let apiState = {}
	      	data && (data.count > 0) && data.data.forEach(api => {
	      		apiState[api.id] = {
	      			...state[api.id],
	      			...api
	      		}
	      	})
	      	return apiState
	      case 'ADD_API' :
	      	return {
	      		...state,
	      		[data.id] : {
	      			...state[data.id],
	      			...data
	      		}
	      	}
        case 'ADD_ACCESS' :
          return {
            ...state,
            [data.id] : {
              ...state[data.id],
              ...{ users: data.data }
            }
          }
        case 'UPDATE_ACCESS' :
          return {
            ...state,
            [data.resourceId] : {
              ...state[data.resourceId],
              ...{ users: state[data.resourceId].users.map( r => r.actorId === data.actorId ? data: r) }
            }
          }
        case 'CREATE_ACCESS' :
          return {
            ...state,
            [data.resourceId] : {
              ...state[data.resourceId],
              ...{ users: [ ...state[data.resourceId].users, data ]
            }
          }
        }
        default : 
        return state;
    }
}

function groupsById(state = {}, action) {
		let data = action.data
    switch(action.type) {
        case 'ADD_GROUPS' :
					data.groups.forEach( group => {
						state = {
							...state,
              [group.id] : {
                ...state[group.id], 
                ...group
              },
							// [group.id]: Object.assign({}, state[group.id], group)
						}
					})
        return state
        case 'ADD_GROUP' :
					state = {
						...state,
						[data.id]: {
							...state[data.id], 
							...data
						}
					}
        return state
        default :
        return state
    }
}

function endpointsById(state = {}, action) {
		let data = action.data
    switch(action.type) {
        case 'ADD_ENDPOINTS' : 
					data.endpoints.forEach( endpoint => {
						state = {
							...state,
              [endpoint.id] : {
                ...state[endpoint.id], 
                ...endpoint
              },
							// [endpoint.id]: Object.assign({}, state[endpoint.id], endpoint)
						}
					})
        return state
        case 'ADD_ENDPOINT' :
					state = {
						...state,
						[data.id]: {
							...state[data.id],
							...data
						}
					}
        return state
        default : return state;
    }
}

function apiSummary(state = { loading: false, stale: false }, action) {
	let data = action.data
	switch(action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        stale: true,
      }
		case 'GROUP_SELECT':
			return {
				...state,
				createGroup: false,
        createSchema: false,
        createEndpoint: false,
        createTextDocument: false,
        selected: data,
				selectedGroup: data,
        withGroup: ''
			}
		case 'GROUP_CREATE':
			return {
				...state,
				createGroup: true,
        createSchema: false,
        createEndpoint: false,
        createTextDocument: false,
        selected: '',
				selectedGroup: '',
        withGroup: '',
			}
		case 'ENDPOINT_SELECT':
			return {
				...state,
				createEndpoint: false,
        createGroup: false,
        createSchema: false,
        createTextDocument: false,
        selected: data,
				selectedEndpoint: data,
        withGroup: '',
			}
		case 'ENDPOINT_CREATE':
			return {
				...state,
				createEndpoint: true,
        createGroup: false,
        createSchema: false,
        createTextDocument: false,
				selectedEndpoint: '',
        selected: '',
        withGroup: data,
			}
    case 'SCHEMA_CREATE':
      return {
        ...state,
        createSchema: true,
        createEndpoint: false,
        selectedSchema: '',
        createGroup: false,
        createTextDocument: false,
        selectedEndpoint: '',
        selected: '',
        withGroup: data,
      }
    case 'TEXTDOCUMENT_CREATE':
      return {
        ...state,
        createSchema: false,
        createEndpoint: false,
        selectedSchema: '',
        createGroup: false,
        createTextDocument: true,
        selected: '',
        selectedEndpoint: '',
        withGroup: data
      }
		case 'START_LOADING':
			return {
				...state,
				loading: true
			}
		case 'STOP_LOADING':
			return {
				...state,
				loading: false,
        stale: false,
			}
		default:
			return state
	}
}
function notifications(state = [], action) {
  let data = action.data
  switch(action.type) {
    case 'SET_NOTIFICATION':
      // return [...state.concat(data)]
      return [data]
    case 'DISMISS_NOTIFICATION':
      // let index = state.indexOf(data)
      return []
      // return [...state.slice(0,index).concat(state.slice(index + 1))]
    default:
      return state
  }
}
const apisReducer = combineReducers({
    byIds : apisById,
});
const groupsReducer = combineReducers({
    byIds : groupsById,
});
const endpointsReducer = combineReducers({
    byIds : endpointsById,
});

const uiReducer = combineReducers({
	apiSummary: apiSummary,
  notifications: notifications
})
