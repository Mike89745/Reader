
import Toast from "react-native-simple-toast";
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
PouchDB.plugin(find)
const db = new PouchDB('Settings', { adapter: 'pouchdb-adapters-rn'});
export const SAVE_SETTINGS = "SAVE_SETTINGS";
export const ERROR_SAVING_SETTINGS = "ERROR_SAVING_SETTINGS";
export const LOAD_SETTINGS = "LOAD_SETTINGS";
export const ERROR_LOADING_SETTINGS = "ERROR_LOADING_SETTINGS";
/**
 * Uloží nastavení
 * @param {*} Settings Objekt Settings
 */
export function saveSettings(Settings) {
    return function(dispatch,getState) {
        db.put({
            _id : "Settings",
            StartScreen : Settings.StartScreen,
            LibraryLayoutSettings : Settings.LibraryLayoutSettings,
            DownloadOverWiFi: Settings.DownloadOverWiFi,
            ReaderLayout: Settings.ReaderLayout,
            _rev : Settings._rev
        }).then(res => { 
            dispatch(savedSettings());
            dispatch(loadSettings());
        }).catch(err => dispatch(errorSavingSettings(err)));
    }
}
/**
 * Načte nastavení
 */
export function loadSettings() {
    return function(dispatch,getState) {
        db.get("Settings").then(res => {
            dispatch(LoadedSettings(res));
        }).catch(err =>{
            if(err.status == "404") {
                const settings = {
                    _id : "Settings",
                    StartScreen : "Library",
                    LibraryLayoutSettings : "Default",
                    DownloadOverWiFi: true,
                    ReaderLayout: "Scroll"
                }
                db.put(settings).then(res=>dispatch(loadSettings())).catch(err=> dispatch(errorLoadingSettings(err)));
            }else{
                dispatch(errorLoadingSettings(err));
            }
        }) 
    }
}
function savedSettings(){
    return{
        type: SAVE_SETTINGS,
        res: "SAVED_SETTINGS",
    }
}
function errorSavingSettings(error){
    return{
        type: ERROR_SAVING_SETTINGS,
        res: "ERROR_SAVING_SETTINGS",
        msg : error
    }
}
function errorLoadingSettings(error){
    return{
        type: ERROR_LOADING_SETTINGS,
        res: "ERROR_LOADING_SETTINGS",
        msg : error
    }
}
function LoadedSettings(settings){
    return{
        type: LOAD_SETTINGS,
        res: "LOAD_SETTINGS",
        Settings : settings,
    }
}
