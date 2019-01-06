import Toast from "react-native-simple-toast";
import PouchDB from 'pouchdb-react-native';
import find from 'pouchdb-find';
PouchDB.plugin(find)
const db = new PouchDB('Library');
const chapters = new PouchDB('chapters');
export const GET_BOOKS = 'GET_BOOKS';
export const GET_BOOKS_FROM_LIBRARY = 'GET_BOOKS_FROM_LIBRARY';
export const GET_BOOKS_ERROR = 'GET_BOOKS_ERROR';
export const GETTINGS_BOOKS = 'GETTINGS_BOOKS';
export const SEARCH_BOOKS = 'SEARCH_BOOKS';
export const SEARCHING_BOOKS = 'SEARCHING_BOOKS';
export const SEARCH_BOOKS_ERROR = 'SEARCH_BOOKS_ERROR';
import {ENDPOINT} from "../../Values/Values"
function GettingBooks(res){
    return{
        gettingBooks : true,
        type: GETTINGS_BOOKS,
        res: res,
        gettingBooksError : false,
    }
}
function GetBooks(CatalogBooks,error,page){
    return{
        gettingBooks : false,
        CatalogBooks : CatalogBooks,
        type: GET_BOOKS,
        res: "Get Books",
        gettingBooksError : error,
        CatalogPage : page
    }
}
function GetBooksFromLibraryRes(CatalogBooks,error,page,category){
    return{
        gettingBooks : false,
        CatalogBooks : CatalogBooks,
        type: GET_BOOKS_FROM_LIBRARY,
        res: "Get Books from Library",
        category: category,
        gettingBooksError : error,
        CatalogPage : page
    }
}
function GetBooksError(error,errormsg){
    return{
        gettingBooks : false,
        type: GET_BOOKS_ERROR,
        res: "Get Books Error",
        gettingBooksError : error,
        errormsg: errormsg
    }
}
export function GetBooksFromAPI(page) {
    return function(dispatch,getState) {
        let data = getState().Booker.CatalogBooks;
        if(!data) data = [];
        dispatch(GettingBooks("Getting Books from API"))
        return  (
            fetch(ENDPOINT +"getBooks/"+ page).then(response =>{
                return response.json()
            }).then((response) => {
                response.rows.map(el => data.push(el));
                dispatch(GetBooks(data,false,page))
            }).catch(error => {
                Toast.show("Error Loading data,please try again later", Toast.LONG);
                dispatch(GetBooksError(true,error))
            })
        )
    }
}
export function GetBooksFromLibrary(category) {
    return function(dispatch,getState) {
        let data = getState().Booker.CatalogBooks;
        if(!data) data = [];
        dispatch(GettingBooks("Getting Books from Library"))
        if(category){
            if(category === "Default"){
                return(
                    db.allDocs({endkey: '_design'}).then((Response) => {
                        Object.assign(data, {[`${category}`]: Response.rows});
                        dispatch(GetBooksFromLibraryRes(data,false,0,category));
                    }).catch(error => {
                        dispatch(GetBooksError(true,error))
                        Toast.show("Failed to get Category", Toast.LONG);
                    })
                )
                    
            }
            else{
                let categories = [];
                categories.push(category);
                return (
                    db.createIndex({
                            index: {
                                fields: ["_id",'categories','tags']
                            }
                    }).then(() => {
                            return db.find({
                                selector: {
                                    categories: {$in : categories}
                                }
                            }).then(res => {
                                let newData = []
                                res.docs.map(docs => newData.push({doc : docs}))
                                Object.assign(data, {[`${category}`]: newData});
                                dispatch(GetBooksFromLibraryRes(data,false,0,category));
                            }).catch(error => {
                                dispatch(GetBooksError(true));
                                Toast.show("Failed to get Category", Toast.LONG);
                            });
                    }).catch((err) => {
                        dispatch(GetBooksError(true,err))
                        Toast.show("Failed to create indexes", Toast.LONG);
                    })
                )
            }
        }
    }
}
function SearchingBooks(){
    return{
        gettingBooks : true,
        type: SEARCHING_BOOKS,
        res: "SEARCHING Books",
        CatalogBooks : [],
        gettingBooksError : false,
    }
}
function SearchBooks(CatalogBooks,error){
    return{
        gettingBooks : false,
        CatalogBooks : CatalogBooks,
        type: SEARCH_BOOKS,
        res: "SEARCH Books",
        gettingBooksError : error,
    }
}
function SearchBooksError(error,errormsg){
    return{
        gettingBooks : false,
        type: SEARCH_BOOKS_ERROR,
        res: "SEARCH BOOKS ERROR",
        gettingBooksError : error,
        errormsg: errormsg
    }
}
export function SearchBooksFromAPI(text,INtags,NINtags) {
    return function(dispatch,getState) {
        dispatch(SearchingBooks("Getting Books from Library"))
        return  (
            fetch(ENDPOINT + 'Search/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                  body: JSON.stringify({text: text, INtags: INtags,NINtags : NINtags})
            }).then(response =>{
                return response.json()
            }).then((response) => {
                let data = [];
                response.docs.map(el => data.push({doc:el}));
                if(data.length === 0) Toast.show("Nothing Found", Toast.LONG);
                dispatch(SearchBooks(data,false))
            }).catch(error => {
                dispatch(SearchBooksError(true,error))
                Toast.show("Searched Failed", Toast.LONG);
            })
        )
    }
}
export function SearchBooksFromLibrary(text,INtags,NINtags) {
    return function(dispatch,getState) {
        dispatch(SearchingBooks("Getting Books from Library"))
        return  (
            db.createIndex({
                index: {
                  fields: ['_id',"author","artist","status","tags"]
                }
              }).then(() => {
                return db.find({
                  selector: {
                    _id : {$regex : text},
                    tags: {$all : INtags},
                    tags: {$nin : NINtags},
                  },
                }).then(res => {
                    let newData = [];
                    res.docs.map(docs => newData.push({doc : docs}));
                    if(data.length === 0) Toast.show("Nothing Found", Toast.LONG);
                }).catch(error => {
                    dispatch(SearchBooksError(true,error))
                    Toast.show("Search Failed! This shouldnt happen!", Toast.LONG);
                });
              }).catch(error => {
                dispatch(SearchBooksError(true,error))
                Toast.show("Failed to create indexese", Toast.LONG);
            })
        )
    }
}