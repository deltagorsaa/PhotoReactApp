import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware  } from "redux";
import {connect, Provider} from "react-redux";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import ReduxThunk from 'redux-thunk';
import {getFromSessionStorage} from './gorsaa_base';

import combineReducers from "./reducers/appReduces";
import ImageApp from './imageApp';

import {onLogonAction} from "./actions/authActions";
import {onLoadDetailImageAction} from "./actions/imageActions";

(function () {
    const store = createStore(combineReducers,{
        Auth: {
            currentUserName:undefined,
            apiAccessKey: '7SFIYAIM7fsoAdrB-kiBNM9kivcyHNRWRAL6ygs0woQ',
            apiSecretKey: 'xrCbrTMHUGIw9pZGnhFZELlSev3-6R-qV5nlT0pW2So',
            apiCallbackUrl:'https://digit.gorshkov-aleksandr.ru',
            authUnsplashObject:undefined,
            logonState: false
        },
        Menu : {
            List: [
                {id:1, name:'Текущие события', searchLink:'current events'},
                {id:2, name:'Собаки', searchLink:'dogs'},
                {id:3, name:'Кошки', searchLink:'cats'},
                {id:4, name:'Море', searchLink:'sea'},
                {id:5, name:'Горы', searchLink:'mount'},
                {id:6, name:'Природа', searchLink:'nature'},
                {id:7, name:'Дайвинг', searchLink:'diving'},
                {id:8, name:'Смотреть всё', searchLink:'/'}
            ],
            Burger:false
        },
        Images:{
            RootImage: {
                data: undefined,
                groupName:'paradise',
                minHeight:500
            },
            DetailImage:undefined,
            ListImages: {
                data: null,
                forRender:[],
                processState: false,
                currentGroup: '',
                currentPage: 0,
                perPage: 10,
                columnCount:undefined,
                imageWidth:400
            },
            WidthSteps:[7680, 5120, 4096, 3200, 2560, 2048, 1920, 1400, 1024, 800, 640, 320]
        },
        UserDialog:{
            isShow:false,
            setClassName:undefined,
            text:'',
            buttons:[]
        }
        }
        ,applyMiddleware(ReduxThunk));

    let RootModule = (props) => {
        const {onLogonAction, detailImage} = props;
        const {logonState, authUnsplashObject} = props.auth;

        const onAnonimLogonAction = () => onLogonAction({code:null, auth:props.auth});
        const onPreUserLogonAction = () => onLogonAction({code:undefined, auth:props.auth});
        const onUserLogonAction = (code) => onLogonAction({code, auth:props.auth});

        if (logonState === false) onAnonimLogonAction();
        return (
            <Router>
                <Route path='/' render={(props) => {
                    const qParams = new URLSearchParams(props.location.search);
                    if (!(logonState === true) && qParams.has('code') && Array.from(qParams).length === 1) {
                        onUserLogonAction(qParams.get('code'));
                        const lastUrl = getFromSessionStorage('lastUrl');
                        props.history.replace('/');
                        return (<Redirect push to={`${lastUrl==='all' ? '' :(lastUrl || '')}`}/>);
                    }
                }}></Route>

                <Switch>
                    <Route exact path='/:groupId/:photoId' render={(props1)=> {
                        if (logonState === false) return (null);
                        const photoId = props1.match.params.photoId;
                        const image = props.images.data.find((elm) => elm.id === photoId);

                        if (detailImage!=image) {
                            props.onLoadDetailImageAction(
                                {
                                    image,
                                    id: photoId,
                                    unsplashAuthApi:authUnsplashObject
                                }
                            );
                        }

                        return ( <ImageApp {...props1} LogOn={onPreUserLogonAction} LogOff={onAnonimLogonAction}/>)
                    }}/>

                    <Route exact path='/:groupId?' render={(props) => logonState === false ? (null) : (<ImageApp {...props} LogOn={onPreUserLogonAction} LogOff={onAnonimLogonAction}/>)}/>
                </Switch>
            </Router>
        );
    };

    const mapStateToProps = (state) => {
        return {
            auth:state.Auth,
            images: state.Images.ListImages,
            detailImage:state.Images.DetailImage
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            onLogonAction: (props) => dispatch(onLogonAction(props)),
            onLoadDetailImageAction:(props) => dispatch(onLoadDetailImageAction(props))
        };
    };

    RootModule = connect( mapStateToProps, mapDispatchToProps )(RootModule);

    ReactDOM.render(
        <Provider store={store}>
            <RootModule></RootModule>
        </Provider>
        ,document.querySelector('.image-app')
    );
})();