import { 
  GET_EDITOR_GROUPS_REQUEST,
  GET_EDITOR_GROUPS_SUCCESS,
  GET_EDITOR_GROUPS_FAILURE,
  GET_EDITOR_GROUP_REQUEST,
  GET_EDITOR_GROUP_SUCCESS,
  GET_EDITOR_GROUP_FAILURE,
  GET_ENDPOINT_REQUEST,
  GET_ENDPOINT_SUCCESS,
  GET_ENDPOINT_FAILURE,
  CREATE_EDITOR_GROUP_REQUEST,
  CREATE_EDITOR_GROUP_SUCCESS,
  CREATE_EDITOR_GROUP_FAILURE,
  CREATE_EDITOR_ENDPOINT_REQUEST,
  CREATE_EDITOR_ENDPOINT_SUCCESS,
  CREATE_EDITOR_ENDPOINT_FAILURE,
  DELETE_EDITOR_ENDPOINT_REQUEST,
  DELETE_EDITOR_ENDPOINT_SUCCESS,
  DELETE_EDITOR_ENDPOINT_FAILURE,
  DELETE_EDITOR_GROUP_REQUEST,
  DELETE_EDITOR_GROUP_SUCCESS,
  DELETE_EDITOR_GROUP_FAILURE
} from '../constants/action_types';

export default function editor(state = { isFetching: false, result: null }, action) {
  switch (action.type) {
    case GET_EDITOR_GROUPS_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case GET_EDITOR_GROUPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case GET_EDITOR_GROUPS_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case GET_EDITOR_GROUP_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case GET_EDITOR_GROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case GET_EDITOR_GROUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case GET_ENDPOINT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case GET_ENDPOINT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case GET_ENDPOINT_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }

    case CREATE_EDITOR_GROUP_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case CREATE_EDITOR_GROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case CREATE_EDITOR_GROUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case CREATE_EDITOR_ENDPOINT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case CREATE_EDITOR_ENDPOINT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case CREATE_EDITOR_ENDPOINT_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case DELETE_EDITOR_ENDPOINT_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case DELETE_EDITOR_ENDPOINT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case DELETE_EDITOR_ENDPOINT_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case DELETE_EDITOR_GROUP_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case DELETE_EDITOR_GROUP_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case DELETE_EDITOR_GROUP_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    default:
      return state
  }
}