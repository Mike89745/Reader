import { combineReducers } from 'redux';
import Booker from "./API/APIReducer"
import Downloader from "./downloader/downloaderReducer"
import DrawerNav from "./DrawerNavigation/DrawerNavigationReducer"
import Settings from "./Settings/SettingsReducer"
const RootReducer = combineReducers({
    Booker,
    Downloader,
    DrawerNav,
    Settings,
});
export default RootReducer;