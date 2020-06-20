import {combineReducers} from 'redux';
import  AuthReducer  from './authReducers';
import  ImageReducer  from './imageReducers';
import  MenuReducer  from './menuReducer';
import DialogReducer from "./dialogReducers";

export default combineReducers({
    Auth:AuthReducer,
    Menu:MenuReducer,
    Images:ImageReducer,
    UserDialog:DialogReducer
});