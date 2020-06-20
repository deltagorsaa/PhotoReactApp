import React from 'react';
import {Link} from "react-router-dom";

const navigationMenu=(props)=>{
    const {MenuGroupList}=props;

    return (
        <ul className="navigation-list">
            {
                MenuGroupList.map((item)=>(
                    <li key={item.id} className="navigation-list__item">
                        <Link to={item.searchLink}>{item.name}</Link>
                    </li>))
            }
        </ul>
    );
};

export default navigationMenu;