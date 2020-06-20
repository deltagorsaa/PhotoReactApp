import {SET_AUTH_CODE_ACTION,SET_CURRENT_USER_ACTION} from '../actions/authActions'

const AuthReducers = (state={},action) => {
    const newState={...state };

    const setAuth=(code)=>{

        switch (code) {
            case null:
                newState.currentUserName=undefined;
                return 'guest';
            case undefined:
                return 'guest';
            default:
                return true;
        }
    };

    switch (action.type) {
        case SET_AUTH_CODE_ACTION:
            newState.logonState=setAuth(action.code);
            newState.authUnsplashObject=action.unsplashApi;
            break;
        case SET_CURRENT_USER_ACTION:
            newState.currentUserName=action.currentUserName;
            break;
    }
    return newState;
};

export default AuthReducers;