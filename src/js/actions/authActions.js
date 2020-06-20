import Unsplash, {toJson} from "unsplash-js";

export const SET_CURRENT_USER_ACTION='SET_CURRENT_USER';
export const SET_AUTH_CODE_ACTION='SET_AUTH_CODE';

export const onLogonAction=(props)=> {
    const {auth, code}=props;
    let unsplashApi;

    const setAnonimusLogon=()=>{
        unsplashApi=new Unsplash({
            accessKey:auth.apiAccessKey
        });
    };

    const onLogonAction =() => {
        unsplashApi=new Unsplash({
            accessKey:auth.apiAccessKey,
            secret: auth.apiSecretKey,
            callbackUrl: auth.apiCallbackUrl
        });

        const authenticationUrl = unsplashApi.auth.getAuthenticationUrl(["public","write_likes","read_user"]);
        location.assign(authenticationUrl);
    };

    const setUserLogon=(code,dispatch)=>{
        unsplashApi=new Unsplash({
            accessKey:auth.apiAccessKey,
            secret: auth.apiSecretKey,
            callbackUrl: auth.apiCallbackUrl
        });

        return unsplashApi.auth.userAuthentication(code)
            .then(res => toJson(res))
            .then((json)=> {
                    unsplashApi.auth.setBearerToken(json.access_token);
                    dispatch({type:SET_AUTH_CODE_ACTION,code,unsplashApi});

                    unsplashApi.currentUser.profile()
                    .then((res) => toJson(res))
                    .then((jso) => dispatch({type: SET_CURRENT_USER_ACTION, currentUserName: jso.name}));
                }
            );
    };

    return dispatch=>{
        switch (code) {
            case null:
                setAnonimusLogon();
                dispatch({type:SET_AUTH_CODE_ACTION,code,unsplashApi});
                break;
            case undefined:
                onLogonAction();
                dispatch({type:SET_AUTH_CODE_ACTION,code,unsplashApi});
                break;
            default:
                setUserLogon(code,dispatch);
        }
    }
};