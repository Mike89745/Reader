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
  react-native run-android --variant=release
  adb reverse tcp:8000 tcp:8000
  react-native log-android


  $ cd android
  $ ./gradlew assembleRelease
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
import PushNotification from 'react-native-push-notification'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {loadSettings} from "./src/reducers/Settings/SettingsActions";
import RootReducer from './src/reducers/MainReducer';
const loggerMiddleware = createLogger();
const store = createStore(RootReducer,applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
));
export default class ReaderApp extends Component {
  componentDidMount(){
    store.dispatch(loadSettings());
  }
  render() {
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
