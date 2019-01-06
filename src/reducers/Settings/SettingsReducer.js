import {LOAD_SETTINGS,SAVE_SETTINGS,ERROR_LOADING_SETTINGS,ERROR_SAVING_SETTINGS } from "./SettingsActions";
export default SettingsReducer = (state = {},action) =>{
    switch (action.type) {
        case LOAD_SETTINGS:
            return Object.assign({}, state, {
                res: action.res,
                Settings : action.Settings,
            })
        case SAVE_SETTINGS:
            return Object.assign({}, state, {
                res: action.res,
            })
        case ERROR_LOADING_SETTINGS:
        case ERROR_SAVING_SETTINGS:
            return Object.assign({}, state, {
                res: action.res,
                msg: action.msg
            })
        default:
            return state
    }
}
