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

import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
//import { ENDPOINT } from '../../Values/Values';
const ENDPOINT = 'http://localhost:8000/'; // 'http://localhost:8000/' 'https://mike.xn--mp8hal61bd.ws/'
PouchDB.plugin(find);
const library = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
const chapters = new PouchDB('chapters', { adapter: 'pouchdb-adapters-rn'});
const User = new PouchDB('User', { adapter: 'pouchdb-adapters-rn'});
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
                /*const newUser = {

                }
                User.put(response.user).then(res => dispatch(savedUser([res,response.user]))).catch(err => dispatch(savedUserError([err,response.user])));*/
                dispatch(signInSucces(response.user))
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
function loadedUser(user){
    return{
        type : LOADED_USER,
        user : user
    }
}
function loadedUserError(err){
    return{
        type : LOADED_USER_ERROR,
        LoadingUserErr : err
    }
}
export function LoadUser(){
    return function(dispatch) {
        User.allDocs().then(res =>{
            if(res.docs.lenght > 0) dispatch(loadedUser(res.docs[0]));
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
   

export function SyncDbs(){
    return function(dispatch,getState) {
        const user = getState().UserReducer.user;
        if(user){
            dispatch(syncing());
            library.sync(`${ENDPOINT}db/${user.nick}-library`, {
                live: true
            }).on('change', function (change) {
                dispatch(syncingChange(change));
            }).on('error', function (err) {
                dispatch(syncingError(err));
            }).on('complete', function (info) {
                dispatch(syncingLibraryComplete(info))
                chapters.sync(`${ENDPOINT}db/${user.nick}-chapters`, {
                    live: true
                }).on('change', function (change) {
                    dispatch(syncingChange(change));
                }).on('error', function (err) {
                    dispatch(syncingError(err));
                }).on('complete', function (info) {
                    dispatch(syncingComplete(info))
                });
            });
        }
       
    }
}
