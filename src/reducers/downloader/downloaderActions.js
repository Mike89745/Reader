export const GET_DOWNLOADS = 'GET_DOWNLOADS';
export const CLEAR_DOWNLOADS = 'CLEAR_DOWNLOADS';
export const SAVE_DOWNLOADS = 'SAVE_DOWNLOADS';
export const SAVING_DOWNLOADS = 'SAVING_DOWNLOADS';
export const START_DOWNLOADS = 'START_DOWNLOADS';
export const STARTED_DOWNLOADS = 'STARTED_DOWNLOADS';
export const REQUEST_DOWNLOADS = 'REQUEST_DOWNLOADS';
export const GET_TASK = 'GET_TASK';
export const TOGGLING_TASK = 'TOGGLING_TASK';
export const TOGGLED_TASK = 'TOGGLED_TASK';
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
      console.log(task.task);
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