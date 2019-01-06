import {GETTING_CHAPTERS,GETTING_CHAPTERS_ERROR,GET_CHAPTERS_FROM_API,GET_CHAPTERS_FROM_LIBRARY,SAVED_CHAPTERS,SAVING_CHAPTERS_ERROR} from "./Chapters"
export default ChaptersReducer = (state = {DrawerNavigation: []},action) =>{
    switch (action.type) {
        case GETTING_CHAPTERS : 
            return Object.assign({}, state, {
                res: action.res,
                loading : action.loading,
                error : action.error,
            })
        case GET_CHAPTERS_FROM_API:
        case GET_CHAPTERS_FROM_LIBRARY :
            return Object.assign({}, state, {
                res: action.res,
                loading : action.loading,
                error : action.error,
                Chapters : action.Chapters,
            })
        case GETTING_CHAPTERS_ERROR:
            return Object.assign({}, state, {
                res: action.res,
                loading : action.loading,
                error : action.error,
                errormsg : action.errormsg
            })
        case SAVED_CHAPTERS:
            return Object.assign({}, state, {
                res: action.res,
            })
        case SAVING_CHAPTERS_ERROR :
            return Object.assign({}, state, {
                res: action.res,
                errormsg : action.error
            })   
        default:
            return state
    }
}
