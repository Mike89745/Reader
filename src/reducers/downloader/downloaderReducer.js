import { combineReducers } from 'redux'
import {
    SAVING_DOWNLOADS,
    SAVE_DOWNLOADS,
    GET_DOWNLOADS,
    REQUEST_DOWNLOADS,
    CLEAR_DOWNLOADS,
    START_DOWNLOADS,
    STARTED_DOWNLOADS,
    GET_TASK,
    TOGGLED_TASK,
    TOGGLING_TASK,
} from "./downloaderActions"
/*
pauseDownload = () => {
    task.pause();
    return {
        type: PAUSE_DOWNLOADS,
        res: "succes",
    }
}
resumeDownload = () => {
    task.resume();
    return {
        type: RESUME_DOWNLOADS,
        res: "succes",
    }
}
clearQueue = () => {
    task.stop();
    saveQueue(null);
    return {
        type: CLEAR_DOWNLOADS,
        res: "succes",
    }
}*/

downloads = (state = {isFetching: false,downloads: []},action) =>{
    switch (action.type) {
        case REQUEST_DOWNLOADS:
            return Object.assign({}, state, {
                isFetching: true,
                isSaving: false,
                res: action.res,
            })
        case GET_DOWNLOADS:
            return Object.assign({}, state, {
                isFetching: false,
                isSaving: false,
                res: action.res,
                downloads: action.downloads,
            
            })
        case GET_TASK:
            return Object.assign({}, state, {
                task: action.task,
            })
        case TOGGLED_TASK:
            return Object.assign({}, state, {
               isPaused : action.isPaused
            })    
        case SAVE_DOWNLOADS:
            return Object.assign({}, state, {
                isFetching: false,
                isSaving: false,
                res: action.res,
            })
        case SAVING_DOWNLOADS:
            return Object.assign({}, state, {
                isFetching: false,
                isSaving: true,
                res: action.res,
            })    
        default:
          return state
      }
}

const rootReducer = combineReducers({
    downloads
});
export default rootReducer;