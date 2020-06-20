import React from 'react';

const userAuth=(props)=>{
    const {onLogonAction,onLogoffAction, logonState,currentUserName} = props
    return (
    <div className="user-data-container">
        {
            logonState===true ? (<span className="user-data-container__user-name">{ currentUserName }</span>) : null
        }
        {
            logonState===true  ?
                (<button
                    className="user-data-container__logoff-button"
                    onClick={onLogoffAction}
                >Выйти</button>)
                :
                (<button
                    className="user-data-container__logon-button"
                    onClick={onLogonAction}
                >Войти</button>)
        }
    </div>
)};

export default userAuth;