import {
    SIGNING_IN,
    SIGNING_UP,
    SIGN_IN_ERROR,
    SIGN_IN_SUCCES,
    SIGN_UP_ERROR,
    SIGN_UP_SUCCES,
    SYNCING,
    SYNCING_CHANGE,
    SYNCING_COMPLETE,
    SYNCING_ERROR,
    SYNCING_LIBRARY_DONE,
    SYNCING_PROGRESS,
    LOADED_USER,
    LOADED_USER_ERROR,
    SAVED_USER,
    SAVED_USER_ERROR,
    LOGMSG, 
} from "./UserActions";
export default UserReducer = (state = {},action) =>{
    switch (action.type) {
        case SIGNING_IN:
            return Object.assign({}, state, {
                signingIn : action.signingIn,
                error : false,
                msg : null,
            })
        case SIGN_IN_SUCCES:
            return Object.assign({}, state, {
                signingIn : false,
                user : action.user,
                error : false,
            })
        case SIGN_IN_ERROR:
            return Object.assign({}, state, {
                signingIn : false,
                user : null,
                error : action.error,
                msg : action.msg,
            })

        case SIGNING_UP:
            return Object.assign({}, state, {
                signingUp : action.signingIn,
                error : false,
                msg : null,
            })
        case SIGN_UP_ERROR:
            return Object.assign({}, state, {
                signingUp : false,
                error : action.error,
                msg : action.msg
            })
        case SIGN_UP_SUCCES:
            return Object.assign({}, state, {
                signingUp : false,
                error : action.error,
                msg : action.msg
            })

        case SYNCING:
            return Object.assign({}, state, {
                syncing : true,
                SyncError : false,
            })
        case SYNCING_CHANGE:
            return Object.assign({}, state, {
                change : action.change,
                SyncError : false,
            })
        case SYNCING_COMPLETE:
            return Object.assign({}, state, {
                syncing : false,
                SyncError : false,
                syncProgress : action.syncProgress,
                SyncMSG : action.SyncMSG
            })
        case SYNCING_ERROR:
            return Object.assign({}, state, {
                SyncError : true,
                errorMsg: action.errorMsg,
            })
        case SYNCING_LIBRARY_DONE:
            return Object.assign({}, state, {
                signingUp : false,
                SyncError : false,
            })
        case SYNCING_PROGRESS : 
            return Object.assign({}, state, {
                syncProgress : action.syncProgress,
                SyncMSG : action.SyncMSG
            })
        case LOADED_USER :
            return Object.assign({}, state, {
                user : action.user
            })
        case LOADED_USER_ERROR :  
            return Object.assign({}, state, {
                LoadingUserErr : action.LoadingUserErr,
                user : null
            })
        case SAVED_USER :
        case SAVED_USER_ERROR : 
            return Object.assign({}, state, {
                savingRes : action.savingRes,
            })  
        case LOGMSG : 
        return Object.assign({}, state, {
            msg : action.msg,
        })            
        default:
            return state
    }
}
