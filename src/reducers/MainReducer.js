import { combineReducers } from 'redux';
import Booker from "./API/APIReducer"
import Downloader from "./downloader/downloaderReducer"
import DrawerNav from "./DrawerNavigation/DrawerNavigationReducer"
const RootReducer = combineReducers({
    Booker,
    Downloader,
    DrawerNav,
});
export default RootReducer;