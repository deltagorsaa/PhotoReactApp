import React from 'react';

const BurgerComponent = (props) => {
    const {OnClickAction} = props

    return (
        <div className='app-menu-component'>
            <button className='app-menu-component__button' onClick={OnClickAction}></button>
        </div>
    );
};

export default BurgerComponent;