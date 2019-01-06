import { combineReducers } from 'redux';
import Booker from "./API/APIReducer"
import Downloader from "./downloader/downloaderReducer"
import DrawerNav from "./DrawerNavigation/DrawerNavigationReducer"
import Settings from "./Settings/SettingsReducer"
import Chapters from "./Chapters/ChaptersReducer"
const RootReducer = combineReducers({
    Chapters,
    Booker,
    Downloader,
    DrawerNav,
    Settings,
});
export default RootReducer;