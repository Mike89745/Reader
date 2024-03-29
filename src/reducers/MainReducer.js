import { combineReducers } from 'redux';
import Booker from "./API/APIReducer"
import Downloader from "./downloader/downloaderReducer"
import DrawerNav from "./DrawerNavigation/DrawerNavigationReducer"
import Settings from "./Settings/SettingsReducer"
import ChaptersReducer from "./Chapters/ChaptersReducer"
import UserReducer from "./User/UserReducer"
import Reviews from "./API/ReviewsReducer"
const RootReducer = combineReducers({
    ChaptersReducer,
    Booker,
    Downloader,
    DrawerNav,
    Settings,
    UserReducer,
    Reviews,
});
export default RootReducer;