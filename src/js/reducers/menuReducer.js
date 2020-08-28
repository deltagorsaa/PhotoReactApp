import {TOGGLE_MENU_STATE_ACTION} from '../actions/menuActions';

const MenuReducer=(state= {}, action)=> {
    const newState = {...state};

    switch (action.type) {
        case TOGGLE_MENU_STATE_ACTION:
            newState.Burger = action.value === undefined ? !newState.Burger : action.value;
            break;
    }

    return newState;
}

export default MenuReducer;