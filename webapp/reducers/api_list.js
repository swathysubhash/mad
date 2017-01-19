import { 
  GETALL_API_REQUEST,
  GETALL_API_SUCCESS,
  GETALL_API_FAILURE,
  CREATE_API_REQUEST,
  CREATE_API_SUCCESS,
  CREATE_API_FAILURE,
  UPDATE_API_REQUEST,
  UPDATE_API_SUCCESS,
  UPDATE_API_FAILURE,
  DELETE_API_REQUEST,
  DELETE_API_SUCCESS,
  DELETE_API_FAILURE,
} from '../constants/action_types';

const initialState = { isFetching: false, result: null }

export default function editor(state = initialState, action) {
  console.log('STATE', state, "ACTION", action)
  switch (action.type) {
    case GETALL_API_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case GETALL_API_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case GETALL_API_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case CREATE_API_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case CREATE_API_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case CREATE_API_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case UPDATE_API_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case UPDATE_API_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case UPDATE_API_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    case DELETE_API_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case DELETE_API_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case DELETE_API_FAILURE:
      return {
        ...state,
        isFetching: false,
        result: null
      }
    default:
      return state
  }
}