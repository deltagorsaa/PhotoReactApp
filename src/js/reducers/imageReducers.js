import {forEach} from "../gorsaa_base";

import {
    LOAD_NEW_IMAGES_ACTION
    ,LOAD_NEW_IMAGES_COMPLITED_ACTION
    ,LOAD_NEW_CUSTOM_IMAGE_ACTION
    ,LOAD_NEW_CUSTOM_IMAGE_COMPLITED_ACTION
    ,CHANGE_IMAGES_GROUP_ACTION
    ,CHANGE_IMAGES_COLUMN_COUNT_ACTION
    ,SET_IMAGE_LIKE_ACTION, SET_DETAIL_IMAGE_ACTION } from '../actions/imageActions';

const ImageReducers = (state= {}, action) => {
    const newState = {...state};
    const { loadedImages } = action;

    const getElementsByColumnCount=(columnCount, actionImages=[])=>{
        const returnValue = [];
        let currentPosition = 0;

        do {
            returnValue.push(actionImages.slice(currentPosition, currentPosition + columnCount));
            currentPosition = currentPosition + columnCount;
        } while (currentPosition < actionImages.length - 1)

        return returnValue;
    };

    switch (action.type) {
        case LOAD_NEW_IMAGES_COMPLITED_ACTION:
                 newState.ListImages.data = newState.ListImages.data === null ? [] : newState.ListImages.data;

                forEach (loadedImages,(image)=>
                    (!newState.ListImages.data.some((itemB) => image.id === itemB.id)) ? newState.ListImages.data.push(image) :null);

                newState.ListImages.forRender = getElementsByColumnCount(state.ListImages.columnCount, newState.ListImages.data);
                newState.ListImages.processState = false;
                newState.ListImages.currentPage++;
                break;
        case CHANGE_IMAGES_GROUP_ACTION:
            newState.ListImages.data = null;
            newState.ListImages.forRender = [];
            newState.ListImages.currentGroup = action.group;
            newState.ListImages.currentPage = 0;
            newState.ListImages.processState = false;
            break;
        case LOAD_NEW_IMAGES_ACTION:
            newState.ListImages.processState = 'loading';
            break;
        case LOAD_NEW_CUSTOM_IMAGE_ACTION:
            break;
        case LOAD_NEW_CUSTOM_IMAGE_COMPLITED_ACTION:
            newState.RootImage.data = loadedImages[0];
            break;
        case CHANGE_IMAGES_COLUMN_COUNT_ACTION:
            newState.ListImages.columnCount = action.columnCount;
            newState.ListImages.forRender = getElementsByColumnCount(action.columnCount, newState.ListImages.data);
            break;
        case SET_IMAGE_LIKE_ACTION:
            const elm=newState.ListImages.data.find((elm) => elm.id === action.image.id);
            const detailImage = newState.DetailImage;

            if (elm != null) {
                if (action.action.toUpperCase() === 'LIKE') {
                    elm.likes++
                    elm.liked_by_user = true;
                } else {
                    elm.likes--;
                    elm.liked_by_user = false;
                }

                if (action.isDetail && detailImage != undefined && detailImage.id == elm.id) {
                    detailImage.likes = elm.likes;
                    detailImage.liked_by_user = elm.liked_by_user;
                }
            }
            else if (detailImage != null && action.isDetail) {
                detailImage.likes++
                detailImage.liked_by_user = true;
            }

            break;
        case SET_DETAIL_IMAGE_ACTION:
            newState.DetailImage = action.loadedImage;
            break;
    }

    return newState;
};

export default ImageReducers;