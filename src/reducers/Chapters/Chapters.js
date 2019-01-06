export const GET_CHAPTERS_FROM_LIBRARY = "GET_CHAPTERS_FROM_LIBRARY";
export const GET_CHAPTERS_FROM_API = "GET_CHAPTERS_FROM_API";
export const GETTING_CHAPTERS = "GETTING_CHAPTERS";
export const GETTING_CHAPTERS_ERROR = "GETTING_CHAPTERS_ERROR";

export const SAVING_CHAPTERS_ERROR = "SAVING_CHAPTERS_ERROR";
export const SAVED_CHAPTERS = "SAVED_CHAPTERS";
import PouchDB from 'pouchdb-react-native';
import find from 'pouchdb-find';
import SimpleToast from '../../../node_modules/react-native-simple-toast';
import { ENDPOINT } from '../../Values/Values';
PouchDB.plugin(find)
const ChaptersDB = new PouchDB('Chapters');
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
    type: type,
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
                dispatch(gotChapters(GET_CHAPTERS_FROM_API,chapters));
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
             dispatch(gotChapters(GET_CHAPTERS_FROM_LIBRARY,response.docs));
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
function savedChapters(){
  return {
    type: SAVED_CHAPTERS,
    res: "SAVED_CHAPTERS",
  }
}
function savedChaptersError(error){
  return {
    type: SAVING_CHAPTERS_ERROR,
    res: "SAVING_CHAPTERS_ERROR",
    errormsg : error
  }
}
export function saveChapters(chapters) {
  return function(dispatch) {
      return  (
        ChaptersDB.bulkDocs(chapters).then(res => {
          dispatch(savedChapters());
        }).catch(err => {
          dispatch(savedChaptersError(err));
        })
      )
  }
}
export function saveChapter(chapter) {
  return function(dispatch) {
      return  (
        ChaptersDB.put(chapter).then(res => {
          dispatch(savedChapters());
        }).catch(err => {
          dispatch(savedChaptersError(err));
        })
      )
  }
}