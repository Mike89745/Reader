export const GET_CHAPTERS_FROM_LIBRARY = "GET_CHAPTERS_FROM_LIBRARY";
export const GET_CHAPTERS_FROM_API = "GET_CHAPTERS_FROM_API";
export const GETTING_CHAPTERS = "GETTING_CHAPTERS";
export const GETTING_CHAPTERS_ERROR = "GETTING_CHAPTERS_ERROR";

export const SAVING_CHAPTERS_ERROR = "SAVING_CHAPTERS_ERROR";
export const SAVED_CHAPTERS = "SAVED_CHAPTERS";

export const LOGMSG="LOGMSG";

import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import PushNotification from 'react-native-push-notification'
import SimpleToast from '../../../node_modules/react-native-simple-toast';
import { ENDPOINT } from '../../Values/Values';
PouchDB.plugin(find)
const ChaptersDB = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
function gettingChapters(){
  return {
    type: GETTING_CHAPTERS,
    res: "GETTING_CHAPTERS",
    loading : true,
    error : false,
  }
}
function gotChapters(type,chapters){
  return {
    type: type,
    res: "GOT_CHAPTERS",
    loading : false,
    error : false,
    Chapters : chapters,
  }
}
function getChaptersError(error){
  return {
    type: GETTING_CHAPTERS_ERROR,
    res: "GETTING_CHAPTERS_ERROR",
    loading : false,
    error : true,
    errormsg : error
  }
}
export function getChaptersFromAPI(book_id) {
    return function(dispatch,getState) {
      dispatch(gettingChapters())
        return  (
          fetch(ENDPOINT + 'getChapters/' + book_id).then(response =>{
            return response.json()
        }).then((response) => {
            let chapters = [];
            response.docs.map((chapter) =>{
                chapters.push({
                  book_id : chapter.book_id,
                  number : chapter.number,
                  title : chapter.title,
                  dateAdded : chapter.dateAdded,
                  MarkedAsRead : false,
                  pages : chapter.pages,
                  lastRead : null,
                  lastPage : 0,
                  type: chapter.type
                })
            })
            if(chapters.length === 0){
                SimpleToast.show("No chapters.",SimpleToast.LONG);
            }else{
                dispatch(saveChapters(chapters));
                dispatch(getChaptersFromLibrary(book_id));
            }  
        }).catch(error =>{
          dispatch(getChaptersError(error));
          SimpleToast.show("Error getting chapters, please Try again",SimpleToast.LONG);
        })
        )
    }
  }
export function getChaptersFromLibrary(book_id) {
  return function(dispatch) {
      dispatch(gettingChapters())
      return  (
        ChaptersDB.createIndex({
          index: {
              fields: ['book_id']
          }
      }).then(() => {
          return ChaptersDB.find({
              selector: {
                book_id : {$eq : book_id},
              }
          }).then(response => {
              response.docs.length > 0 ? dispatch(gotChapters(GET_CHAPTERS_FROM_LIBRARY,response.docs.sort((a, b) => b.number - a.number))) : null
          }).catch(err => {
              dispatch(getChaptersError(err));
              SimpleToast.show("Error getting chapters",SimpleToast.LONG);
          });
      }).catch(err => {
          dispatch(getChaptersError(err));
          SimpleToast.show("Error creating chapters indexes",SimpleToast.LONG);
      })
      )
  }
}
function savedChapters(res){
  return {
    type: SAVED_CHAPTERS,
    res: "Saved chapters" + res,
  }
}
function savedChaptersError(error){
  return {
    type: SAVING_CHAPTERS_ERROR,
    res: "SAVING_CHAPTERS_ERROR",
    errormsg : error
  }
}
function logMSG(MSG){
  return {
    type: LOGMSG,
    res: "LOGMSG",
    errormsg : MSG
  }
}
export function saveChapters(chapters) {
  return function(dispatch) {
      return  (
        ChaptersDB.bulkDocs(chapters).then(res => {
          dispatch(savedChapters(res));
        }).catch(err => {
          dispatch(savedChaptersError([err,chapters]));
        })
      )
  }
}
export function saveChapter(chapter) {
  return function(dispatch) { 
    const NewChapter =  {
      _id : chapter._id,
      _rev : chapter._rev,
      book_id : chapter.book_id,
      number : chapter.number,
      title : chapter.title,
      dateAdded : chapter.dateAdded,
      MarkedAsRead : chapter.MarkedAsRead,
      pages : chapter.pages,
      lastRead : chapter.lastRead,
      lastPage : chapter.lastPage,
      type: chapter.type
    }
      return  (
        ChaptersDB.put(NewChapter).then(res => {
          dispatch(savedChapters(res));
        }).catch(err => {
          dispatch(savedChaptersError([err,chapter]));
        })
      )
  }
}
function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.title === current.title && other.number === current.number
    }).length == 0;
  }
}
export function UpdateTitles(Titles) {
  return function(dispatch) {
    let notificationMessage = ``
    let NewAdded = false;
    let TitleCount =Titles.length;
    for (let a = 0; a < TitleCount; a++) {
      fetch(ENDPOINT + 'getChapters/' + Titles[a]).then(response =>{
        return response.json()
      }).then((response) => {
          if(response.docs.length > 0){
              let chapters = [];
              response.docs.map((chapter) =>{
                  chapters.push({
                      book_id : chapter.book_id,
                      number : chapter.number,
                      title : chapter.title,
                      dateAdded : chapter.dateAdded,
                      MarkedAsRead : false,
                      pages : chapter.pages,
                      lastRead : null,
                      lastPage : 0,
                      type: chapter.type
                  })
              })
              ChaptersDB.createIndex({
                  index: {
                      fields: ['book_id']
                  }
              }).then(() => {
                  return ChaptersDB.find({
                      selector: {
                        book_id : {$eq : Titles[a]},
                      }
                  }).then(response => {
                      let onlyInA = response.docs.filter(comparer(chapters));
                      let onlyInB = chapters.filter(comparer(response.docs));
                      let result = onlyInA.concat(onlyInB);
                      if(result.length > 0 ){
                        NewAdded = true;
                        notificationMessage += `${Titles[a]}\n`
                        dispatch(saveChapters(result));
                        if(TitleCount < 2){
                          dispatch(getChaptersFromLibrary(Titles[a]));
                        }
                      }
                      if(TitleCount-1 == a){
                        let message = null;
                        NewAdded ? message = notificationMessage : message = "No new Chapters";
                        PushNotification.localNotification({
                          id: "42069", //for android cancel notification (must be stringified number)
                          message: message,
                          title: "Updated Titles",
                        }); 
                      }else{
                        PushNotification.localNotification({
                          id: "42069", //for android cancel notification (must be stringified number)
                          message: Titles[a],
                          title: "Updating Titles",
                          vibrate: false,
                          priority:"low",
                          importance : "min",
                        }); 
                      }
                  }).catch(err => {
                    dispatch(getChaptersError(err));
                  });
              }).catch(err => {
                dispatch(getChaptersError(err));
              })
          }else{
            PushNotification.localNotification({
              id: "42069", //for android cancel notification (must be stringified number)
              message: Titles[a],
              title: "Updating Titles",
              vibrate: false,
              priority:"low",
              importance : "min",
            }); 
          }
      }).catch(error =>{
        dispatch(getChaptersError(error));
      })
    }; 
      
  }
}
