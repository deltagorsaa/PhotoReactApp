export const SET_USER_DIALOG_ACTION = 'SET_USER_DIALOG';

export const onSetDialogAction = (props) => {
    return {
        type:SET_USER_DIALOG_ACTION,
        ...props
    };
};

