import { SET_FILTER_DRAWER,SET_MAIN_DRAWER,LOCK_FILTER_DRAWER,LOCK_MAIN_DRAWER,SET_ACTIVE_ROUTE} from "./DrawerNavigationActions";
export default DrawerNavigation = (state = {DrawerNavigation: []},action) =>{
    switch (action.type) {
        case SET_MAIN_DRAWER:
            return Object.assign({}, state, {
                res: action.res,
                MainDrawer : action.MainDrawer,
            })
        case SET_FILTER_DRAWER:
            return Object.assign({}, state, {
                res: action.res,
                FilterDrawer : action.FilterDrawer,
            })
        case LOCK_FILTER_DRAWER:
        case LOCK_MAIN_DRAWER:
            return Object.assign({}, state, {
                res: action.res,
            })
        case SET_ACTIVE_ROUTE:
            return Object.assign({}, state, {
                ActiveRoute : action.ActiveRoute,
            })
        default:
            return state
    }
}
