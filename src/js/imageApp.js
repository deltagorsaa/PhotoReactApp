import React from 'react';
import { connect } from "react-redux";

import {saveToSessionStorage } from './gorsaa_base';

import ImageSearch from './components/imageSearchComponent';
import NavigationMenu from './components/navigationComponent';
import UserAuth from './components/userAuthComponent';
import PhotoList from './components/photoListComponent';
import Dialog from "./components/dialogComponent";
import PictureGenerator  from './components/pictureGenerator';
import PhotoDetail from './components/photoDetailComponent';
import Burger from './components/burgerComponent';

import  { onPhotoLikeAction,onLoadImagesRequestAction ,onChangeImageGroupAction, onLoadRootImageRequestAction, onChangePhotoListColumnCountAction } from './actions/imageActions';
import { onSetDialogAction } from './actions/popupsActions';
import { onBurgerClickAction } from  './actions/menuActions';

import '../css/root.css';
import {Route} from "react-router";

class ImageApp extends React.Component {
    #extDisallowLoadImageFlag = false;
    #addNewPhoto=(page,extDisallowFlag = false) => {
        if (
            this.props.images.processState === false
            && this.#extDisallowLoadImageFlag === false
            && this.props.unsplashAuthApi != null
        ) {
            this.#extDisallowLoadImageFlag = extDisallowFlag;
            this.props.onLoadImagesRequestAction(
                {
                    page,
                    per_page: this.props.images.perPage,
                    searchGroupName: this.props.images.currentGroup,
                    unsplashAuthApi: this.props.unsplashAuthApi
                })();
        }
    };
    #getCurrentImageGroupId = () => this.props.match.params.groupId || 'all';

    #changeIfCheckImageGroup = () => {
        const groupId = this.#getCurrentImageGroupId();
        if (groupId.toUpperCase() != this.props.images.currentGroup.toUpperCase()) {
            this.props.onChangeImageGroupAction(groupId);
            return true;
        }
        return false;
    }

    #onDocumentScrollEventHandler = (evt) => {
        if (document.body.clientHeight - window.scrollY < 3 * window.innerHeight)
            this.#addNewPhoto(this.props.images.currentPage + 1,true);
    }

    #photoElementsResizeEventHandler = (columnCount) => {
        if (this.props.images.columnCount != columnCount)
            this.props.onChangePhotoListColumnCountAction({columnCount});
    }
    #onLikeActionEventHandler = (props) => {
        const {image} = props;
        if (!(this.props.logonState === true))
            this.props.onSetDialogAction({
            isShow:true,
            setClassName:'warning',
            text:'Чтобы ставить лайки необходимо выполнить вход.',
            buttons:[
                {type:'ok', text:'Войти', action:() => {
                        this.props.onSetDialogAction({isShow:false});
                        this.props.LogOn();
                    }},
                {type:'cancel', text:'Отмена', action:() => {
                    this.props.onSetDialogAction({isShow:false});
                }}
            ]});
        else this.props.onPhotoLikeAction(
            {
                image,
                unsplashAuthApi:this.props.unsplashAuthApi,
                action:(image.liked_by_user) ? 'UNLIKE' : 'LIKE',
                isDetail:props.isDetail
            })() ;

    }

    constructor(props) {
        super(props);

        this.#changeIfCheckImageGroup();

        this.props.onLoadRootImageRequestAction({
            unsplashAuthApi:this.props.unsplashAuthApi,
            searchGroupName:this.props.rootImage.groupName})();

        document.addEventListener('scroll', this.#onDocumentScrollEventHandler);

    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.#onDocumentScrollEventHandler);
    }
    componentDidUpdate(prevProps,prevState,snapshot) {
        saveToSessionStorage('lastUrl', this.props.location.pathname);

        this.#extDisallowLoadImageFlag = this.props.images.processState;
        const groupId = this.#getCurrentImageGroupId();

        if (this.#changeIfCheckImageGroup())
            this.props.onBurgerClickAction({value:false});

        if (
            groupId.toUpperCase() === this.props.images.currentGroup.toUpperCase()
            && this.props.images.data === null
        )  this.#addNewPhoto(this.props.images.currentPage + 1);
    }

    render() {
        const { menuDataStore, logonState, images, onSetDialogAction, history, dialog, rootImage, detailImage, currentUserName } = this.props;
        document.body.style.overflowY = 'auto';
        menuDataStore.Burger ?
            document.body.classList.add('app-menu-isopen') :
            document.body.classList.remove('app-menu-isopen');

        return <div className='root-container'>

            <header className="header-container">
                <div className="header-top-container">

                    <ImageSearch EntryComplited={(value) => history.push(`/${value}`)}/>
                    <UserAuth
                        logonState={logonState}
                        currentUserName={currentUserName}
                        onLogonAction={this.props.LogOn}
                        onLogoffAction={ () => {
                            onSetDialogAction({
                                isShow:true,
                                setClassName:'warning',
                                text:'После выхода вы не сможете ставить лайки. Продолжить?',
                                buttons:[
                                    {type:'ok', text:'Да', extClass:'ok', action:()=>{
                                            onSetDialogAction({isShow:false});
                                            this.props.LogOff();
                                        }},
                                    {type:'cancel', text:'Нет', extClass:'cancel', action:() => onSetDialogAction({isShow:false})}
                                ]});
                        }}/>
                        <Burger OnClickAction={this.props.onBurgerClickAction}/>
                </div>

                <nav className="header-navigation-container">
                    <NavigationMenu MenuGroupList={menuDataStore.List}/>
                </nav>

            </header>
            <main>
                <section className="big-logo-container">
                    <div className='blackout'>
                    {
                        rootImage.data != undefined ?
                            <PictureGenerator
                                Image={rootImage.data}
                                Height={760}
                                WidthSteps={[...this.props.widthSteps]}
                                ImgDefaultWidth={window.innerWidth}/>
                             : null
                    }
                    </div>
                    <h2 className="big-logo-container__header">React&nbsp;Redux Photo&nbsp;App</h2>
                </section>
                {
                    images.data != null && images.data.length > 0 ?
                        <PhotoList
                            OnResizeEvent={this.#photoElementsResizeEventHandler}
                            ImageList={images.forRender}
                            Width={images.imageWidth}
                            WidthSteps={[...this.props.widthSteps]}
                            ImgDefaultWidth={images.imageWidth}
                            OnLikeAction={(data) => this.#onLikeActionEventHandler({...data, isDetail: false})}
                            UrlData={this.props.urlData}
                        /> :
                        (images.processState==false ? <span className='images-not-found-text'>Изображения не найдены</span> : null)
                }
            </main>

            <Route exact path='/:groupId/:photoId' render={(props1) => {
                document.body.style.overflowY='hidden';
                return (
                    detailImage!=null ?
                        <PhotoDetail
                            Buttons={[{
                                type: 'cancel',
                                text: '',
                                extClass: '',
                                action:()=>props1.history.length < 3 ? props1.history.push('/') : props1.history.goBack()
                            }]}
                            Image={detailImage}
                            Width={detailImage.width >= detailImage.height ? window.innerWidth * 0.8 : undefined}
                            Height={detailImage.width <= detailImage.height ? window.innerHeight * 0.8 : undefined}
                            WidthSteps={[...this.props.widthSteps]}
                            ImgDefaultWidth={window.innerWidth}
                            OnLikeAction={(data) => this.#onLikeActionEventHandler({...data, isDetail:true})}
                        /> : null
                )}
            }>
            </Route>
            {
                dialog.isShow ? <Dialog {...dialog}/> : null
            }
        </div>
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        menuDataStore: state.Menu,
        logonState:state.Auth.logonState,
        unsplashAuthApi:state.Auth.authUnsplashObject,
        currentUserName:state.Auth.currentUserName,
        rootImage:state.Images.RootImage,
        images:state.Images.ListImages,
        detailImage:state.Images.DetailImage,
        widthSteps:state.Images.WidthSteps,
        dialog:state.UserDialog,
        urlData:ownProps.match
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadImagesRequestAction: (props) => dispatch(onLoadImagesRequestAction(props)),
        onChangeImageGroupAction:(props) => dispatch(onChangeImageGroupAction(props)),
        onSetDialogAction:(props) => dispatch(onSetDialogAction(props)),
        onLoadRootImageRequestAction:(props) => dispatch(onLoadRootImageRequestAction(props)),
        onChangePhotoListColumnCountAction:(props) => dispatch(onChangePhotoListColumnCountAction(props)),
        onPhotoLikeAction:(props) => dispatch(onPhotoLikeAction(props)),
        onBurgerClickAction:(props) => dispatch(onBurgerClickAction(props))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(ImageApp);