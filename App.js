/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
/*
Commads
  react-native run-android
  adb reverse tcp:8081 tcp:8081
  react-native log-android
*/
/*
Main Colors
  #FFFFFF
  #51A3A3
  #505050
*/
import React, {Component} from 'react';
import {StyleSheet, View,Button} from 'react-native';
import Layout from "./src/Containers/Layout/Layout";
import { MenuProvider } from 'react-native-popup-menu';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {loadData, nextDownload} from "./src/reducers/downloader/downloaderActions";
import Toast from 'react-native-simple-toast';
import RootReducer from './src/reducers/MainReducer';
const loggerMiddleware = createLogger();
const store = createStore(RootReducer,applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
));
export default class ReaderApp extends Component {
  componentWillMount(){ 
    //this.ReAttachingDownloads();
    console.log("appMounted");
    
    //store.dispatch(loadData());
  }
  componentDidMount(){
    //Toast.show('This is a long toast.', Toast.LONG);
  }
  test(){
    store.dispatch(nextDownload());
  }
  render() {
    //<Button title="Test Download" onPress={() => this.test()}/>

    return (
      <Provider store={store}>
        <MenuProvider>
          <View style={styles.container}>
            <Layout/>
          </View>
        </MenuProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});
