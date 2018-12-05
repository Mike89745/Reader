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
export function nextDownload() {
  return function(dispatch,getState) {
      dispatch(startingDownloads())
      let data = getState().downloads.downloads;
      if(data.length > 0){
        let title = data[0].title;
        let chapter = data[0].chapter;
        let page = data[0].pageStatus.findIndex(el => el.status===0);
        if(page === -1){
          data.shift();
          if(data.length > 0){
            title = data[0].title;
            chapter = data[0].chapter;
            page = data[0].pageStatus.findIndex(el => el.status===0);
          }
          dispatch(saveData(data));
        }
        if(data.length > 0 && page != -1){
          let task = RNBackgroundDownloader.download({
            id: title + "//"+ chapter + "//" + page,
            url: `http://localhost:8000/public/books/${title}/${chapter}/${page}`,
            destination: `${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${page}.jpg`
          }).begin((expectedBytes) => {
              //console.log(`Going to download ${expectedBytes} bytes!`);
          }).progress((percent) => {
              //console.log(`Downloaded: ${percent * 100}%`,page);
          }).done(() => {
              data[0].pageStatus[page].status = 1;
              dispatch(getTask("task",task));
              dispatch(saveData(data));
              dispatch(nextDownload());
          }).error((error) => {
              RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${page}.jpg`).then(response => {
                console.log(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${page}.jpg`, response);
                  if(response) { 
                    data[0].pageStatus[page].status = 1;
                    dispatch(saveData(data));
                    if(!getState().downloads.isPaused) dispatch(nextDownload());
                  }else{
                    console.log('Download canceled due to error: ', error,title,chapter,page);
                  }
              });
          });
          return  (
            dispatch(startedDownloads(true))
          )
        }else{
          return( dispatch(startedDownloads(false)))
        } 
      }else{
        return( dispatch(startedDownloads(false)))
      } 
  
     
  }
}
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
export function toggleDownloads() {
  return function(dispatch,getState) {
      dispatch(togglingDownloads())
      let task = getState().downloads;
      if(task.task){
        if(!task.isPaused){
          task.task.pause();
          return  (
            dispatch(toggledDownloads(true))
          )
        }else{
          dispatch(toggledDownloads(false))
          return  (
            dispatch(nextDownload())
          )
        }
      }else{
        dispatch(toggledDownloads(false));
        return  (
          dispatch(nextDownload())
        )
      }
  }
}

export function toggleSelectHeader() {
  return function(dispatch,getState) {
    dispatch(togglingSelectHeader())
      let visible = getState().downloads.selectHeaderVisible;
      visible ? null : false;
      !visible ? null : dispatch(deselectAll());
      return  (
       dispatch(toggledSelectHeader(!visible))
      )
  }
}
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

export function getchapterRefs() {
  return function(dispatch,getState) {
    dispatch(gettingChaptersRefs())
      let refs = getState().downloads.chaptersRefs
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
export function selectAll() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
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
export function deselectAll() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
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
export function deleteSelected() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
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
export function donwloadSelectedChapters() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
      let queueData = getState().downloads.downloads;
      if(!queueData) queueData = []; 
      refs ? refs.forEach(ref => {
        if(ref.getSelect() && ref.getPages() > 0){

          let title = ref.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
          let chapter = (ref.props.chapterCount +"-"+ref.props.chapterName).replace(/[/\\?%*:|"<>. ]/g, '-');
          
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
          for (let index = 0; index < ref.getPages(); index++) {
              pages.push({status: 0});
          }
          queueData.push({
              title : title,
              chapter: chapter,
              pageStatus : pages,
          });
        }else{
          dispatch(failedToAddDownloads("failed"));
        }
      }) : null;
      dispatch(saveData(queueData));
      dispatch(nextDownload());
      return  (
       dispatch(donwloadSelected())
      )
  }
}
function markedAsRead(refs) {
  return {
    type: MARK_AS_READ_CHAPTERS,
    res: "Marked All selected Chapters Refs as read",
    chaptersRefs: refs,
  }
}
export function markAsRead() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
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
export function unmarkAsRead() {
  return function(dispatch,getState) {
      let refs = getState().downloads.chaptersRefs
      refs ? refs.forEach(ref => {
        if(ref.getSelect())  ref.unmarkAsRead();
      }) : null;
      return  (
       dispatch(unmarkedAsRead(refs))
      )
  }
}
export function clearChapters() {
  return function(dispatch,getState) {
      let refs = []
      return  (
        dispatch(setChaptersRefs(refs))
      )
  }
}