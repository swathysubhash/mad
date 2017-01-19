import { combineReducers } from 'redux'
import apiList from './api_list'
import editor from './editor'

const rootReducer = combineReducers({
  apiList,
  editor
})

export default rootReducer