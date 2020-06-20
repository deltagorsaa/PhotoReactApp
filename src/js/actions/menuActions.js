export const TOGGLE_MENU_STATE_ACTION='TOGGLE_MENU_STATE';

export const onBurgerClickAction=(props)=> {
    const {value=undefined}=props
    return {
        type:TOGGLE_MENU_STATE_ACTION,
        value
    };
};
