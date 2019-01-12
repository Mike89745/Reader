import { SET_FILTER_DRAWER,SET_MAIN_DRAWER,LOCK_FILTER_DRAWER,LOCK_MAIN_DRAWER} from "./DrawerNavigationActions";
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
                activeRoute : action.activeRoute,
            })
        default:
            return state
    }
}
