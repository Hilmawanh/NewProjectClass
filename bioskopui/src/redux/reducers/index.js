import {combineReducers} from 'redux'
import AuthReducers from './AuthReducers'
import NotifReducer from './notifReducer'

export default combineReducers({
    Auth:AuthReducers,
    NotifReducer:NotifReducer
})