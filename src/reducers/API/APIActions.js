import Toast from "react-native-simple-toast";
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
PouchDB.plugin(find)
const db = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});

export const GET_BOOKS = 'GET_BOOKS';
export const GET_BOOKS_FROM_LIBRARY = 'GET_BOOKS_FROM_LIBRARY';
export const GET_BOOKS_ERROR = 'GET_BOOKS_ERROR';
export const GETTINGS_BOOKS = 'GETTINGS_BOOKS';

export const SEARCH_BOOKS = 'SEARCH_BOOKS';
export const SEARCHING_BOOKS = 'SEARCHING_BOOKS';
export const SEARCH_BOOKS_ERROR = 'SEARCH_BOOKS_ERROR';

export const GETTING_REVIEWS = "GETTING_REVIEWS";
export const GOT_REVIEWS = "GOT_REVIEWS";
export const GOT_REVIEWS_ERROR = "GOT_REVIEWS_ERROR";
export const CREATED_REVIEW = "CREATED_REVIEW";
export const CREATED_REVIEW_ERROR = "CREATED_REVIEW_ERROR";

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
function GetBooksFromLibraryRes(CatalogBooks,error){
    return{
        gettingBooks : false,
        CatalogBooks : CatalogBooks,
        type: GET_BOOKS_FROM_LIBRARY,
        res: "Get Books from Library",
        gettingBooksError : error,
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
                Toast.show(ENDPOINT +"getBooks/"+ page + "Error Loading data,please try again later", Toast.LONG);
                dispatch(GetBooksError(true,error))
            })
        )
    }
}
export function GetBooksFromLibrary() {
    return function(dispatch,getState) {
        let data = getState().Booker.CatalogBooks;
        if(!data) data = [];
        dispatch(GettingBooks("Getting Books from Library"))
        return(
            db.allDocs({endkey: '_design',include_docs: true}).then((Response) => {
                dispatch(GetBooksFromLibraryRes(Response.rows,false));
            }).catch(error => {
                dispatch(GetBooksError(true,error))
                Toast.show("Failed to get Category", Toast.LONG);
            })
        )
    }
}
export function ClearBooks() {
    return function(dispatch,getState) {
       getState().Booker.CatalogBooks = [];
    }
}
function SearchingBooks(text){
    return{
        gettingBooks : true,
        type: SEARCHING_BOOKS,
        res: text,
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
        dispatch(SearchingBooks("Getting Books from API"))
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
                    newData.length === 0 ? Toast.show("Nothing Found", Toast.LONG) : dispatch(SearchBooks(newData,false));
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
export function CreateReview(Review){
    return function(dispatch){
        fetch(`${ENDPOINT}addReview`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(Review),
        }).then((response) => {
            response.json().then((body) => {
                console.log(body);
                body.error ? dispatch(CreateReviewError(true,body.errormsg)) : dispatch(CreatedReview())
            });
        });
    }
}
export function getReviewsFromAPI(book_id){
    return function(dispatch){
        dispatch(gettingReviews());
        fetch(`${ENDPOINT}getReviews/${book_id.replace(/[/\\?%*:|"<>. ]/g, '-')}`, )
        .then(response =>{
            return response.json()
        }).then((response) => {
            let data = [];
            console.log(response);
            response.docs.map(el => data.push({doc:el}));
            if(data.length === 0) Toast.show("Nothing Found", Toast.LONG);
            dispatch(gotReviews(data,false))
        }).catch(error => {
            dispatch(gotReviewsError(true,error))
            //Toast.show("Searched Failed", Toast.LONG);
        })
    }
}
function gettingReviews(){
    return{
        type: GETTING_REVIEWS,
        gettingReviews : true
    }
}
function gotReviews(Reviews,error){
    return{
        type: GOT_REVIEWS,
        Reviews : Reviews,
        gettingReviews : false
    }
}
function gotReviewsError(error,errormsg){
    return{
        type: GOT_REVIEWS_ERROR,
        gettingReviews : false,
        ReviewError: error,
        ReviewErrorMSG : errormsg,
    }
}
function CreateReviewError(error,errormsg){
    return{
        type: CREATED_REVIEW_ERROR,
        ReviewError: error,
        ReviewErrorMSG : errormsg,
    }
}
 
function CreatedReview(){
    return{
        type: CREATED_REVIEW,
        ReviewError : false,
    }
}