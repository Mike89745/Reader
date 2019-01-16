export const SIGN_IN_SUCCES = "SIGN_IN_SUCCES";
export const SIGN_IN_ERROR = "SIGN_IN_ERROR";
export const SIGNING_IN = "SIGNING_IN";

export const SIGN_UP_SUCCES = "SIGN_UP_SUCCES";
export const SIGN_UP_ERROR = "SIGN_UP_ERROR";
export const SIGNING_UP = "SIGNING_IN";

export const SYNCING = "SYNCING";
export const SYNCING_COMPLETE = "SYNCING_COMPLETE";
export const SYNCING_ERROR = "SYNCING_ERROR";
export const SYNCING_CHANGE = "SYNCING_CHANGE";
export const SYNCING_LIBRARY_DONE = "SYNCING_LIBRARY_DONE";

export const LOADED_USER = "LOADED_USER";
export const LOADED_USER_ERROR = "LOADED_USER_ERROR";
export const SAVED_USER = "SAVED_USER";
export const SAVED_USER_ERROR = "SAVED_USER_ERROR";

export const LOGMSG = "LOGMSG";

import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import RNFS from "react-native-fs";
import { ENDPOINT } from '../../Values/Values';
import {saveData,toggleDownloads} from '../downloader/downloaderActions'
//const ENDPOINT = 'http://localhost:8000/'; // 'http://localhost:8000/' 'https://mike.xn--mp8hal61bd.ws/'
PouchDB.plugin(find);
const library = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
const chapters = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
const User = new PouchDB('User', { adapter: 'pouchdb-adapters-rn'});
const categoriesDB = new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
function signingIn(){
    return{
        type : SIGNING_IN,
        signingIn : true,
        error : false,
    }
}
function signInSucces(user){
    return{
        type : SIGN_IN_SUCCES,
        signingIn : false,
        error : false,
        user: user,
    }
}
function signingInError(err){
    return{
        type : SIGN_IN_ERROR,
        signingIn : false,
        msg : err,
        error : true,
    }
}
function savedUser(res){
    return{
        type : SAVED_USER,
        savingRes : res,
    }
}
function savedUserError(err){
    return{
        type : SAVED_USER_ERROR,
        savingRes : err,
    }
}
export function saveUser(user){
    return function(dispatch) {
        User.allDocs({include_docs:true}).then(res =>{
            if(res.rows.length === 0){
                const newUser ={
                    email : user.email,
                    password : user.password,
                    nick : user.nick,
                }
                User.post(newUser).then(res => {
                    dispatch(savedUser(res))
                }).catch(err => dispatch(savedUserError(err)))
            }else{
                const updateUser ={
                    _id : res.rows[0].doc._id,
                    _rev : res.rows[0].doc._rev,
                    email : user.email,
                    password : user.password,
                    nick : user.nick,
                }
                User.put(updateUser).then(res => {
                    dispatch(savedUser(res))
                }).catch(err => dispatch(savedUserError(err)))
            }
        }).catch(err => dispatch(savedUserError(err)))
    }
}
export function SignIn(email,password){
    return function(dispatch) {
        dispatch(signingIn());
        fetch(`${ENDPOINT}Login`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email:email,password:password}),
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.error) {
                dispatch(signingInError(response.msg))
            }else{
                response.user.password = password
                dispatch(saveUser(response.user));
                dispatch(signInSucces(response.user));
            }
        }).catch(err => {dispatch(signingInError(err))});
    }
}

function signingUp(){
    return{
        type : SIGNING_UP,
        signingUp : true,
        error : false,
    }
}
function signUpSucces(){
    return{
        type : SIGN_UP_SUCCES,
        signingUp : false,
        error : false,
    }
}
function signingUpError(err){
    return{
        type : SIGN_UP_ERROR,
        signingUp : false,
        error : true,
        msg : err
    }
}
export function SignUp(nick,password,email){
    return function(dispatch) {
        dispatch(signingUp());
        fetch(`${ENDPOINT}Register`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({nick:nick,password:password,email:email}),
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if(response.error) {
                dispatch(signingUpError(response.msg))
            }else{
                dispatch(signUpSucces(response.user))
            }
        }).catch(err => {dispatch(signingUpError(err))});
    }
}
export function SignOut(){
    return function(dispatch) {
        User.allDocs({include_docs:true}).then(res =>{
            if(res.rows.length > 0){
                User.remove(res.rows[0].doc).then(res=>{
                    dispatch(savedUser(res));
                    dispatch(LoadUser())
                }).catch(err => dispatch(savedUserError(err)))
            }else{
                dispatch(loadUser())
            }
        }).catch(err => dispatch(loadedUserError(err)))
    }
}
function loadedUser(user){
    return{
        type : LOADED_USER,
        user : user
    }
}
function loadedUserError(err){
    return{
        type : LOADED_USER_ERROR,
        LoadingUserErr : err,
        user : null,
    }
}
export function LoadUser(){
    return function(dispatch) {
        User.allDocs({include_docs:true}).then(res =>{
            dispatch(loadedUserError(res))
            if(res.rows.length > 0){ 
                dispatch(loadedUser(res.rows[0].doc));
            }else{
                dispatch(loadedUserError(res))
            }
        }).catch(err => dispatch(loadedUserError(err)))
    }
}
function syncing(){
    return{
        type : SYNCING,
        SyncError : false,
        syncing : true,
    }
}
function syncingChange(change){
    return{
        type : SYNCING_CHANGE,
        SyncError : false,
        change : change,
    }
}
function syncingError(err){
    return{
        type: SYNCING_ERROR,
        SyncError : true,
        errorMsg: err,
    }
}
function syncingComplete(info){
    return{
        type : SYNCING_COMPLETE,
        syncing : false,
        SyncError : false,
        info : info
    }
}
function syncingLibraryComplete(info){
     return{
        type: SYNCING_LIBRARY_DONE,
        SyncError : false,
        libInfo : info,
    }
}
function logMSG(msg){
    return{
        type: LOGMSG,
        msg : msg
    }
}   
function CreateCategories(newBooks){
    return function(dispatch){
        let categories = []
        newBooks.forEach(book =>{
            book.categories.forEach(category =>{
                categories.includes(category) ? null : categories.push(category);
            })
        });
        dispatch(logMSG([categories]));
        categoriesDB.allDocs({include_docs : true}).then(res =>{
            res.rows.forEach(category =>{
                categories.includes(category.doc.id) ? categories.splice(categories.indexOf(category.doc.id)) : null;
            })
            dispatch(logMSG([categories]));
            categories.forEach(category =>{
                categoriesDB.put({_id : category}).then(res => console.log(res)).catch(err => console.log(err,"added category err"))
            })
        })
    }
}
export function SyncDbs(){
    return function(dispatch,getState) {
        const user = getState().UserReducer.user;
        if(user){
            dispatch(syncing());
            library.sync(`${ENDPOINT}db/${user.nick}-library`)
            .on('change', function (change) {
                let newBooks = change.change.docs;
                let booksIDs = [];
                let pages = [];
                newBooks.forEach(book => {
                    booksIDs.push(book._id.replace(/[/\\?%*:|"<>. ]/g, '-'));
                    pages.push({status: 0});
                });
                let thumbnails = [{
                    title: "New thumbnails",
                    chapter : "",
                    pageStatus : pages,
                    thumbnails : true,
                    booksIDs : booksIDs
                }];
                dispatch(CreateCategories(newBooks))
                dispatch(saveData(thumbnails))
                dispatch(syncingChange([change,thumbnails]));
            }).on('error', function (err) {
                dispatch(syncingError(err));
            }).on('complete', function (info) {
                dispatch(syncingLibraryComplete(info))
                chapters.sync(`${ENDPOINT}db/${user.nick}-chapters`, {
                }).on('change', function (change) {
                    dispatch(syncingChange(change));
                }).on('error', function (err) {
                    dispatch(syncingError(err));
                }).on('complete', function (info) {
                    dispatch(syncingComplete(info));
                    dispatch(toggleDownloads());
                });
            });
        }
       
    }
}
