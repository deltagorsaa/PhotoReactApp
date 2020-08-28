import React from 'react';

const PopupComponent = (props) => {
    const {closeAction} = props;
    const onClickActionEventHandler = (evt) => evt.currentTarget === evt.target ? closeAction() : null;

    return (
     <div className='popup-container' onClick={onClickActionEventHandler}>
         <div className='fixed-container'>
             <button className="popup-container__close-button" onClick={onClickActionEventHandler}>x</button>
             { props.children }
         </div>
     </div>
    );
};

export default PopupComponent;