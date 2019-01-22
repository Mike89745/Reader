import { DrawerActions } from 'react-navigation';
export const SET_MAIN_DRAWER = "SET_MAIN_DRAWER";
export const LOCK_MAIN_DRAWER = "LOCK_MAIN_DRAWER";
export const SET_FILTER_DRAWER = "SET_FILTER_DRAWER";
export const LOCK_FILTER_DRAWER = "LOCK_FILTER_DRAWER";
export const SET_ACTIVE_ROUTE = "SET_ACTIVE_ROUTE";
export function ToggleFilterDrawer() {
    return function(dispatch,getState) {
        const FilterDrawer = getState().DrawerNav.FilterDrawer;
        FilterDrawer.toggleDrawer();
       
    }
}
export function ToggleMainDrawer() {
    return function(dispatch,getState) {
       getState().DrawerNav.MainDrawer.toggleDrawer();
    }
}

export function SetActiveRoute(Route){
    return function(dispatch){
        dispatch(ActiveRouteSet(Route));
    }
}
function ActiveRouteSet(Route){
    return{
        type : SET_ACTIVE_ROUTE,
        ActiveRoute : Route,
    }
}
function MainDrawerSet(nav){
    return{
        type: SET_MAIN_DRAWER,
        res: "SET_MAIN_DRAWER",
        MainDrawer : nav,
    }
}
function FilterDrawerSet(nav){
    return{
        type: SET_FILTER_DRAWER,
        res: "SET_FILTER_DRAWER",
        FilterDrawer : nav,
    }
}
export function setMainDrawer(nav){
    return function(dispatch,getState) {
        return(dispatch(MainDrawerSet(nav)))
     }
}
export function setFilterDrawer(nav){
    return function(dispatch,getState) {
        return(dispatch(FilterDrawerSet(nav)))
    }
}