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

    TOGGLED_SELECTHEADER,
    SETTING_CHAPTERREFS,
    SET_CHAPTERREFS,
    GET_CHAPTERREFS,
    SELECT_CHAPTERS,
    DELETE_CHAPTERS,
    DESELECT_CHAPTERS,
    DOWNLOAD_CHAPTERS,
    MARK_AS_READ_CHAPTERS,
    UNMARK_AS_READ_CHAPTERS
} from "./downloaderActions"

export default downloads = (state = {isFetching: false,downloads: []},action) =>{
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
        case TOGGLING_TASK:
            return Object.assign({}, state, {
                res: "Toggling",
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
        case TOGGLED_SELECTHEADER:
            return Object.assign({}, state, {
                res: action.res,
                selectHeaderVisible: action.selectHeaderVisible,
            })
        case SET_CHAPTERREFS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case GET_CHAPTERREFS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case SELECT_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case DESELECT_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case MARK_AS_READ_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case UNMARK_AS_READ_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case DELETE_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })
        case DOWNLOAD_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
                chaptersRefs: action.chaptersRefs,
            })                                       
        default:
          return state
      }
}