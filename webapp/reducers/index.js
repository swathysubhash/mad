import { combineReducers } from 'redux'
import apiList from './api_list'
import editor from './editor'
import entities from './entities'
const rootReducer = combineReducers({
  entities
})

export default rootReducer