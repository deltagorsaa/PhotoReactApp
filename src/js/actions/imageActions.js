import {toJson} from "unsplash-js";

export const LOAD_NEW_IMAGES_ACTION='LOAD_NEW_IMAGES';
export const LOAD_NEW_IMAGES_COMPLITED_ACTION='LOAD_NEW_IMAGES_COMPLITED';
export const LOAD_NEW_CUSTOM_IMAGE_ACTION='LOAD_NEW_CUSTOM_IMAGE';
export const LOAD_NEW_CUSTOM_IMAGE_COMPLITED_ACTION='LOAD_NEW_CUSTOM_IMAGE_COMPLITED';
export const CHANGE_IMAGES_GROUP_ACTION='CHANGE_IMAGES_GROUP';
export const CHANGE_IMAGES_COLUMN_COUNT_ACTION='CHANGE_IMAGES_COLUMN_COUNT';
export const SET_IMAGE_LIKE_ACTION='SET_IMAGE_LIKE';
export const SET_DETAIL_IMAGE_ACTION='SET_DETAIL_IMAGE';

const loadImages=(dispatch, unsplashAuthApi, page, per_page, orderBy,nextDispatchName)=>
    unsplashAuthApi.photos.listPhotos(page,per_page,orderBy)
        .then((res)=>toJson(res))
        .then((jso)=>dispatch({
            type: nextDispatchName,
            loadedImages: jso
        }));

const loadImagesByGroupName=(dispatch,unsplashAuthApi,page, per_page, searchGroupName,nextDispatchName,filter={})=>{
    unsplashAuthApi.search.photos(searchGroupName, page,per_page,filter)
        .then((res)=>toJson(res))
        .then((jso)=>
        {
            dispatch({
                type: nextDispatchName,
                loadedImages: jso.results
            })
        });
};

export const onLoadImagesRequestAction=(props)=> {
    const {page, per_page, searchGroupName, unsplashAuthApi} = props;
    return dispatch => {
        dispatch({type: LOAD_NEW_IMAGES_ACTION});
        return ()=> {
                (searchGroupName).toUpperCase()!='ALL' ?
                loadImagesByGroupName(dispatch, unsplashAuthApi, page, per_page,searchGroupName,LOAD_NEW_IMAGES_COMPLITED_ACTION) :
                loadImages(dispatch,unsplashAuthApi, page, per_page, 'latest',LOAD_NEW_IMAGES_COMPLITED_ACTION)
        }
    };
};

export const onLoadRootImageRequestAction=(props)=> {
    const {unsplashAuthApi,searchGroupName} = props;
    return dispatch => {
        dispatch({type: LOAD_NEW_CUSTOM_IMAGE_ACTION});

        return ()=>loadImagesByGroupName(
                dispatch,
                unsplashAuthApi,
                Math.round(Math.random()*100) ,
                1,
                searchGroupName,
                LOAD_NEW_CUSTOM_IMAGE_COMPLITED_ACTION,
                {orientation: "landscape"})
}};

export const onChangeImageGroupAction=(props)=>{
    return {
        type:CHANGE_IMAGES_GROUP_ACTION,
        group:props
    }
};

export const onChangePhotoListColumnCountAction=(props)=>{
  return {
      type:CHANGE_IMAGES_COLUMN_COUNT_ACTION,
      columnCount:props.columnCount
  }
};

export const onPhotoLikeAction=(props)=>{
    const {action,image, unsplashAuthApi,isDetail}=props;
    return dispatch => {
        return ()=>
            (action.toUpperCase()==='LIKE' ?
                unsplashAuthApi.photos.likePhoto(image.id) :
                unsplashAuthApi.photos.unlikePhoto(image.id))
                .then(dispatch({ type:SET_IMAGE_LIKE_ACTION, action, image,isDetail}))
    }
};

export const onLoadDetailImageAction=(props)=>{
    const {image,id,unsplashAuthApi}=props;

    return dispatch => {
        if (image!=undefined) {
            dispatch({ type:SET_DETAIL_IMAGE_ACTION, loadedImage:image});
            return ()=>{};
        } else {
            return()=>unsplashAuthApi.photos.getPhoto(id)
                .then((res) => toJson(res))
                .then((jso) => dispatch({
                    type: SET_DETAIL_IMAGE_ACTION,
                    loadedImage: jso
                }));
        }
    }
};




