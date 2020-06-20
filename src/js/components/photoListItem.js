import {Link} from "react-router-dom";
import PictureGenerator from "./pictureGenerator";
import React from "react";

const PhotoListItem=(props)=>{
    const { Image,WidthSteps,Width,OnLikeAction,WithLink=false,Height,IsStatic,ImgDefaultWidth }=props;

    const groupId=WithLink ? (props.UrlData.params.groupId===undefined ? 'all' : props.UrlData.params.groupId) : '';

    return (
            <figure>
                {
                    WithLink ?
                        <Link to={`/${groupId}/${Image.id}`}>
                            <PictureGenerator
                                Image={Image}
                                ImgDefaultWidth={ImgDefaultWidth}
                                Width={Width}
                                WidthSteps={WidthSteps}
                                IsStatic={IsStatic}
                                Height={Height}
                            />
                        </Link>
                        :
                        <PictureGenerator
                            Image={Image}
                            ImgDefaultWidth={ImgDefaultWidth}
                            Width={Width}
                            WidthSteps={WidthSteps}
                            IsStatic={IsStatic}
                            Height={Height}
                        />
                }

                <figcaption className='photos-list-item-description'>
                    <div className='photos-list-item-description_ext'>
                        <span>{(()=>{
                            const date=new Date(Image.created_at);
                            return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
                        })() }</span>
                        <button
                            className={'photos-list-item-description_ext__likes-button'}
                            onClick={()=>OnLikeAction({image:Image})}>

                            <span className={`like-heart-icon ${Image.liked_by_user===true ? 'isliked' : ''}`}>&hearts;</span>
                            <span>{Image.likes}</span>

                        </button>
                    </div>
                    <a className={'photos-list-item-description_ext__author-link'} href={`https://unsplash.com/@${Image.user.username}`} target={'_blank'}>
                        <span>{Image.user.name}</span>
                    </a>
                </figcaption>
            </figure>
    );
}

export default PhotoListItem;