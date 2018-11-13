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
import {Platform, StyleSheet, Text, View,TouchableOpacity,ListView} from 'react-native';
import RNFileSelector from 'react-native-file-selector';
import RNFetchBlob from 'rn-fetch-blob';
import Layout from "./src/Containers/Layout/Layout";


export default class App extends Component {
  state = {
  }


 
  render() {

    return (
      <View style={styles.container}>
        <Layout/>
      </View>
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
