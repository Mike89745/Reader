import Booker from "./API/APIReducer"
import Downloader from "./downloader/downloaderReducer"
import { combineReducers } from 'redux';
const RootReducer = combineReducers({
    Booker,
    Downloader
});
export default RootReducer;