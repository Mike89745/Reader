export const GET_DOWNLOADS = 'GET_DOWNLOADS';
export const CLEAR_DOWNLOADS = 'CLEAR_DOWNLOADS';
export const SAVE_DOWNLOADS = 'SAVE_DOWNLOADS';
export const SAVING_DOWNLOADS = 'SAVING_DOWNLOADS';
export const START_DOWNLOADS = 'START_DOWNLOADS';
export const STARTED_DOWNLOADS = 'STARTED_DOWNLOADS';
export const FAILED_TO_ADD_DOWNLOADS = 'FAILED_TO_ADD_DOWNLOADS';
export const REQUEST_DOWNLOADS = 'REQUEST_DOWNLOADS';

export const GET_TASK = 'GET_TASK';
export const TOGGLING_TASK = 'TOGGLING_TASK';
export const TOGGLED_TASK = 'TOGGLED_TASK';

export const TOGGLING_SELECTHEADER = 'TOGGLING_SELECTHEADER';
export const TOGGLED_SELECTHEADER = 'TOGGLED_SELECTHEADER';

export const SETTING_CHAPTERREFS= 'SETTING_CHAPTERREFS';
export const SET_CHAPTERREFS= 'SET_CHAPTERREFS';
export const GETTING_CHAPTERREFS= 'GETTING_CHAPTERREFS';
export const GET_CHAPTERREFS= 'GET_CHAPTERREFS';
export const SELECT_CHAPTERS= 'SELECT_CHAPTERREFS';
export const DESELECT_CHAPTERS= 'DESELECT_CHAPTERREFS';
export const DELETE_CHAPTERS= 'DELETE_CHAPTERREFS';
export const MARK_AS_READ_CHAPTERS= 'MARK_AS_READ_CHAPTERS';
export const UNMARK_AS_READ_CHAPTERS= 'UNMARK_AS_READ_CHAPTERS';
export const DOWNLOAD_CHAPTERS= 'DOWNLOAD_CHAPTERS';

import { AsyncStorage } from "react-native";
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from "react-native-fs";
import PushNotification from 'react-native-push-notification'
import {syncingComplete} from "../User/UserActions"
import { ENDPOINT } from "../../Values/Values";
function requestDownloads() {
    return {
      type: REQUEST_DOWNLOADS,
      res: 0,
    }
  }
function getDownloads(res,downloads) {
  return {
    type: GET_DOWNLOADS,
    res: res,
    downloads: downloads,
  }
}
function getTask(res,task) {
  return {
    type: GET_TASK,
    res: res,
    task: task,
  }
}
function savingDownloads() {
  return {
    type: SAVING_DOWNLOADS,
    res: "saving",
  }
}
function saveDownloads() {
  return {
    type: SAVE_DOWNLOADS,
    res: "saved",
  }
}
function clearedDownloads() {
  return {
    type: CLEAR_DOWNLOADS,
    res: "cleared",
    downloads : []
  }
}
function startingDownloads() {
  return {
    type: START_DOWNLOADS,
    res: "Starting",
  }
}
function startedDownloads(res) {
  return {
    type: STARTED_DOWNLOADS,
    res: res,
  }
}
function failedToAddDownloads(res) {
  return {
    type: FAILED_TO_ADD_DOWNLOADS,
    res: res,
  }
}
function togglingDownloads() {
  return {
    type: TOGGLING_TASK,
    res: "Toggling",
  }
}
function toggledDownloads(res) {
  return {
    type: TOGGLED_TASK,
    res: "Toggling",
    isPaused : res,
  }
}
function toggledSelectHeader(visible) {
  return {
    type: TOGGLED_SELECTHEADER,
    res: "Toggled",
    selectHeaderVisible : visible,
  }
}
function togglingSelectHeader() {
  return {
    type: TOGGLING_SELECTHEADER,
    res: "Toggling",
  }
}
/**
 * Načte data stahování z zařízení.
 */
export function loadData() {
  return function(dispatch) {
      dispatch(requestDownloads())
      return  (
        AsyncStorage.getItem('DownloadQueue').then(response => {
            dispatch(getDownloads("succes",JSON.parse(response)))
            error => console.log('An error occurred.', error)
          })
      )
  }
}
/**
 * Uloží data stahování do zařízení.
 * @param {*} data Data k uložení
 */
export function saveData(data) {
  return function(dispatch,getState) {
    dispatch(savingDownloads())
      return  (
        AsyncStorage.setItem('DownloadQueue',JSON.stringify(data)).then(response => {
            dispatch(saveDownloads())
            error => console.log('An error occurred.', error)
          })
      )
  }
}
/**
 * Při spuštění aplikace dokončí nedodělané stahování. Stane se pouze pokud aplikace byla neočekávaně ukončena.
 */
export function ReattachDownloads() {
  return async function(dispatch) {
    dispatch(startingDownloads())
      let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
      if(lostTasks.length > 0){
        for (let task of lostTasks) {
          console.log(`Task ${task.id} was found!`);
          task.progress((percent) => {
            console.log(`Downloaded: ${percent * 100}%`);
          }).done(() => {
            dispatch(getTask("task",task));
            dispatch(nextDownload());
          }).error((error) => {
            console.log('Download canceled due to error: ', error);
          });
        }
      }else{
        return  (
          dispatch(startedDownloads(false))
        )
      }
      return  (
        dispatch(startedDownloads(true))
      )
  }
}
/**
 * Při dokončení stahování obrázku začne stahovat další ve frontě a vytovří notifikaci.
 */
export function nextDownload() {
  return function(dispatch,getState) {
    dispatch(startingDownloads())
    const isPaused = getState().Downloader.isPaused ? true : false;
    let data = getState().Downloader.downloads ? getState().Downloader.downloads : [];
    if(data.length > 0 && isPaused){
      let title = data[0].title;
      let chapter = data[0].chapter;
      let page = data[0].pageStatus.findIndex(el => el.status===0);
      let type = data[0].type;
      if(page === -1){
        if(data[0].Thumbnails){
          dispatch(syncingComplete())
        }
        data.shift();
        if(data.length > 0){
          title = data[0].title;
          chapter = data[0].chapter;
          page = data[0].pageStatus.findIndex(el => el.status===0);
          type = data[0].type;
        }
        dispatch(saveData(data));
      }
      if(data.length > 0 && page != -1){
        let task = RNBackgroundDownloader.download({
          id: title + "//"+ chapter + "//" + page,
          url: data[0].Thumbnails ? 
          `${ENDPOINT}public/Thumbnails/${data[0].booksIDs[page]}` : 
          `${ENDPOINT}public/books/${title}/${chapter}/${type === "IMAGE" ? page + 1 : chapter + `${type === "PDF" ? ".pdf" : ".epub"}`}` ,
          destination: 
          data[0].Thumbnails ? 
          `${RNFS.DocumentDirectoryPath}/Thumbnails/${data[0].booksIDs[page]}.jpg` 
          : 
          `${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${type === "IMAGE" ? page + 1 :chapter}.${type === "IMAGE" ? "jpg" : type === "PDF" ? "pdf" : type ==="EPUB" ? "epub" : "jpg"}`
        }).begin((expectedBytes) => {
            //console.log(`Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
            //console.log(`Downloaded: ${percent * 100}%`,page);
        }).done(() => {

            data[0].pageStatus[page].status = 1;
            let pages = data[0].pageStatus;
            if(data.length < 2 && pages.filter(el => {return el.status === 1 ?  el : null}).length === pages.length){
              PushNotification.localNotification({
                id: "7726", // jakékoli string číslo
                title: "Download Complete",
                message: "",
                ongoing: false,
               
              });
              dispatch(clearDownloads());
              if(data[0].Thumbnails){
                dispatch(syncingComplete())
              }
            }else{
              PushNotification.localNotification({
                id: "69420", 
                title: "Downloading....",
                message : data[0].title.replace("-"," ") +" "+data[0].chapter.replace("-"," ") +": "+pages.filter(el => {return el.status === 1 ?  el : null}).length + "/"  +pages.length.toString(),
                priority:"default",
                importance : "default",
                ongoing: false,
                vibrate: false,
              });
            }
            dispatch(getTask("task",task));
            dispatch(saveData(data));
            dispatch(nextDownload());
        }).error((error) => {
            RNFS.exists(data[0].Thumbnails ? `${RNFS.DocumentDirectoryPath}/Thumbnails/${data[0].booksIDs[page]}.jpg` : `${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${page + 1}.${type === "IMAGE" ? "jpg" : type === "PDF" ? "pdf" : type ==="EPUB" ? "epub" : "jpg"}`).then(response => {
                if(response) { 
                  data[0].pageStatus[page].status = 1;
                  dispatch(saveData(data));
                  if(isPaused) dispatch(nextDownload());
                }else{
                  dispatch(startedDownloads(error))
                  PushNotification.localNotification({
                    id: "69420", 
                    title: "Download Error",
                    message: "please clear queue",
                    ongoing: false,
                  });
                }
            });
        });
        return  (
          dispatch(startedDownloads(true))
        )
      }else{
        if(data.length === 0 && isPaused){
          PushNotification.localNotification({
            id: "69420", 
            title: "Download Complete",
            message: "",
            ongoing: false,
           
          });
          dispatch(clearDownloads());
        }else if(data.length > 0 && !isPaused){
          PushNotification.localNotification({
            id: "69420", 
            title: "Download Paused",
            message: "",
            ongoing: false,
          });
        }else{
          PushNotification.localNotification({
            id: "69420", 
            title: "Download Error",
            message: "please clear queue",
            ongoing: false,
          });
        }
        return( dispatch(startedDownloads(false)))
      } 
    }else{
      if(data.length === 0 && isPaused){
        PushNotification.localNotification({
          id: "69420", 
          title: "Download Complete",
          message: "",
          ongoing: false,
          
        });
        dispatch(clearDownloads());
      }else if(data.length > 0 && !isPaused){
        PushNotification.localNotification({
          id: "69420", 
          title: "Download Paused",
          message: "",
          ongoing: false,
        });
      }else{
        PushNotification.localNotification({
          id: "69420", 
          title: "Download Error",
          message: "Please clear queue.",
          ongoing: false,
        });
      }
      return( dispatch(startedDownloads(false)))
    } 
  }
}
/**
 * Smaže všechny aktuálně stahováné kapitoly z fronty.
 */
export function clearDownloads() {
  return function(dispatch) {
    dispatch(savingDownloads())
      return  (
        AsyncStorage.setItem('DownloadQueue',JSON.stringify([])).then(response => {
            dispatch(clearedDownloads());
            dispatch(loadData());
            error => console.log('An error occurred.', error)
          })
      )
  }
}
/**
 * Pozastavý nebo spustí stahování.
 * @param {*} toggle Zda-li se má kontrolovat jestli je stahování spuštěné
 */
export function toggleDownloads(toggle = false) {
  return function(dispatch,getState) {
      dispatch(togglingDownloads())
      if(!toggle){
        const isPaused = getState().Downloader.isPaused ? true:false;
        if(isPaused){
          dispatch(toggledDownloads(false));
         
        }else{
          dispatch(toggledDownloads(true));
          dispatch(nextDownload());
        }
      }else{
        dispatch(toggledDownloads(true));
        dispatch(nextDownload());
      }
      
  }
}
/**
 * Zobrazí nebo skryje UI pro vybírání kapitol
 */
export function toggleSelectHeader() {
  return function(dispatch,getState) {
    dispatch(togglingSelectHeader())
      let visible = getState().Downloader.selectHeaderVisible;
      visible ? null : false;
      !visible ? null : dispatch(deselectAll());
      return  (
       dispatch(toggledSelectHeader(!visible))
      )
  }
}
/**
 * Nastavý reference polý komponentů kapitol do statu
 * @param {*} refs Pole referencí na komponenty kapitoly
 */
export function setchapterRefs(refs) {
  return function(dispatch) {
      dispatch(settingChaptersRefs())
      return  (
        dispatch(setChaptersRefs(refs))
      )
  }
}
function settingChaptersRefs() {
  return {
    type: SETTING_CHAPTERREFS,
    res: "setting ChaptersRefs",
  }
}
function setChaptersRefs(refs) {
  return {
    type: SET_CHAPTERREFS,
    res: "set ChaptersRefs",
    chaptersRefs: refs,
  }
}
function gettingChaptersRefs() {
  return {
    type: GETTING_CHAPTERREFS,
    res: "gettingChaptersRefs",
  }
}
function getChaptersRefs(refs) {
  return {
    type: GET_CHAPTERREFS,
    res: "getChaptersRefs",
    chaptersRefs: refs,
  }
}
/**
 * Vrací pole kapitol
 */
export function getchapterRefs() {
  return function(dispatch,getState) {
    dispatch(gettingChaptersRefs())
      let refs = getState().Downloader.chaptersRefs
      return  (
        dispatch(getChaptersRefs(refs))
      )
  }
}
function selectedAll(refs) {
  return {
    type: SELECT_CHAPTERS,
    res: "selected All Chapters Refs",
    chaptersRefs: refs,
  }
}
/**
 * Vybyre všechny kapitoly
 */
export function selectAll() {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      refs.forEach(ref => {
        if(!ref.getSelect())  ref.select();
      });
      return  (
       dispatch(selectedAll(refs))
      )
  }
}
function deselectedAll(refs) {
  return {
    type: DESELECT_CHAPTERS,
    res: "deselected All Chapters Refs",
    chaptersRefs: refs,
  }
}
/**
 * Odznačí všechny kapitoly
 */
export function deselectAll() {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      refs ? refs.forEach(ref => {
        if(ref.getSelect())  ref.deselect();
      }) : null;
      return  (
       dispatch(deselectedAll(refs))
      )
  }
}
function deletedSelected(refs) {
  return {
    type: DELETE_CHAPTERS,
    res: "deleted All selected Chapters Refs",
    chaptersRefs: refs,
  }
}
/**
 * Smaže vybrané kapitoly
 */
export function deleteSelected() {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      refs.forEach(ref => {
        if(ref.getSelect())  ref.deleteChapter();
      });
      return  (
       dispatch(deletedSelected(refs))
      )
  }
}
function donwloadSelected() {
  return {
    type: DOWNLOAD_CHAPTERS,
    res: "donwload All selected Chapters Refs",
  }
}
/**
 * Přidá do fronty všechny kapitoly dané knihy
 */
export function downloadAll(){
  return function(dispatch) {
    return (dispatch(donwloadSelectedChapters(true)))
  }
}
/**
 * Přidá do fronty všechny vybrané kapitoly dané knihy
 * @param {*} all Zda-li má přidat všechny kapitoly do fronty
 */
export function donwloadSelectedChapters(all = false) {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      let queueData = getState().Downloader.downloads;
      if(!queueData) queueData = []; 
      refs ? refs.forEach(ref => {
        if(ref.getSelect() || all){
          if(!ref.getDownloaded()){
            let title = ref.props.chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
            let chapter = (ref.props.chapter.number +"-"+ref.props.chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
            let type = ref.props.chapter.type;
            RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title).then(response => {
              if(!response) {
                RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title);
              }
            });
            RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title + "/" + chapter).then(response => {
              if(!response) {
                RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title+ "/" + chapter);
              }
            });
            let pages = [];
            if(type === "IMAGE"){
              for (let index = 0; index < ref.props.chapter.pages; index++) {
                pages.push({status: 0});
              }
            }else{
              pages.push({status: 0});
            }
           
            queueData.push({
              type : type,
              title : title,
              chapter: chapter,
              pageStatus : pages,
            });
          }else{
            dispatch(failedToAddDownloads("failed"));
          }
        }
      }) : null;
      dispatch(saveData(queueData));
      dispatch(toggleDownloads(true));
      return  (
       dispatch(donwloadSelected())
      )
  }
}
/**
 * Stáhne jednu vybranou kapitolu
 * @param {*} chapterToDowload Kapitola k přidání do fronty
 */
export function DownloadSingle(chapterToDowload){
  return function(dispatch,getState){
    let queueData = getState().Downloader.downloads;
    if(!queueData) queueData = [];
    let title = chapterToDowload.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
    let chapter = (chapterToDowload.number +"-"+chapterToDowload.title).replace(/[/\\?%*:|"<>. ]/g, '-');
    let type = chapterToDowload.type;
    RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title).then(response => {
      if(!response) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title);
      }
    });
    RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title + "/" + chapter).then(response => {
      if(!response) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title+ "/" + chapter);
      }
    });
    let pages = [];
    if(type === "IMAGE"){
      for (let index = 0; index < chapterToDowload.pages; index++) {
        pages.push({status: 0});
      }
    }else{
      pages.push({status: 0});
    }
   
    queueData.push({
      type : type,
      title : title,
      chapter: chapter,
      pageStatus : pages,
    });
    dispatch(saveDownloads(queueData));
    dispatch(toggleDownloads(true)); 
  }
}
function markedAsRead(refs) {
  return {
    type: MARK_AS_READ_CHAPTERS,
    res: "Marked All selected Chapters Refs as read",
    chaptersRefs: refs,
  }
}
/**
 * Označí vybrané kapitoly jako přečtené
 */
export function markAsRead() {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      refs ? refs.forEach(ref => {
        if(ref.getSelect())  ref.markAsRead();
      }) : null;
      return  (
       dispatch(markedAsRead(refs))
      )
  }
}
function unmarkedAsRead(refs) {
  return {
    type: UNMARK_AS_READ_CHAPTERS,
    res: "Unmarked All selected Chapters Refs as read",
    chaptersRefs: refs,
  }
}
/**
 * Označí vybrané kapitoly jako nepřečtené
 */
export function unmarkAsRead() {
  return function(dispatch,getState) {
      let refs = getState().Downloader.chaptersRefs
      refs ? refs.forEach(ref => {
        if(ref.getSelect())  ref.unmarkAsRead();
      }) : null;
      return  (
       dispatch(unmarkedAsRead(refs))
      )
  }
}
/**
 * Resetuje pole kapitol
 */
export function clearChapters() {
  return function(dispatch,getState) {
      let refs = []
      return  (
        dispatch(setChaptersRefs(refs))
      )
  }
}
