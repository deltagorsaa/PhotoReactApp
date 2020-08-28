import {SET_USER_DIALOG_ACTION} from '../actions/popupsActions';

const DialogReducers = (state= {}, action) => {
    let newState = {...state};

    switch (action.type) {
        case SET_USER_DIALOG_ACTION:
            newState = {...action};

            delete newState.type;
            break;
    }
    return newState;
};

export default DialogReducers;