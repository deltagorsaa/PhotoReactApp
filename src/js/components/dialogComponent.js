import React from 'react';
import PopupComponent from "./popupComponent";

const DialogComponent = (props) => {
    const {setClassName, text, buttons} = props;
    let buttonKey = 0;
    return (
        <PopupComponent closeAction = {buttons.find((item) => item.type === 'cancel').action  || null}>
            <div className={`dialog-container ${setClassName}`}>
                <div className="dialog-container__icon">
                    <span className="dialog-container__icon-text"></span>
                </div>
                <div className="dialog-container_message-text">{text}</div>
            </div>
            <div className='dialog-container-buttons'>
                {
                    buttons.map((button) =>
                        <button key={++buttonKey} className={`dialog-container-buttons__button ${button.extClass}`} onClick={button.action}>{button.text}</button>
                    )}
            </div>
        </PopupComponent>
    );
};

export default DialogComponent;