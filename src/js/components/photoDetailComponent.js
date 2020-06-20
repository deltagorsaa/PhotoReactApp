import React from 'react';
import PopupComponent from "./popupComponent";
import PhotoListItem  from './photoListItem';

const PhotoDetailComponent=(props)=>{
    const { Buttons,Image,Width,WidthSteps,OnLikeAction,Height,ImgDefaultWidth}=props;
    if (Image===undefined) return (null);

    return (
        <PopupComponent closeAction={Buttons.find((item)=>item.type==='cancel').action  || null}>
            <div className={'detail-photo-container'}>
                <PhotoListItem
                    Image={Image}
                    Width={Width}
                    Height={Height}
                    WidthSteps={WidthSteps}
                    OnLikeAction={OnLikeAction}
                    IsStatic={true}
                    WithLink={false}
                    ImgDefaultWidth={ImgDefaultWidth}
                />
            </div>
        </PopupComponent>
    );
};

export default PhotoDetailComponent;