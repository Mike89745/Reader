import { SET_FILTER_DRAWER,SET_MAIN_DRAWER} from "./DrawerNavigationActions";
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
        default:
            return state
    }
}
