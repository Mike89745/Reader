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
import RNBackgroundDownloader from 'react-native-background-downloader';
import axios from 'react-native-axios';

export default class App extends Component {
  state = {
  }
  async ReAttachingDownloads(){
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
      for (let task of lostTasks) {
        console.log(`Task ${task.id} was found!`);
        task.progress((percent) => {
          console.log(`Downloaded: ${percent * 100}%`);
        }).done(() => {
          console.log('Downlaod is done!');
        }).error((error) => {
          console.log('Download canceled due to error: ', error);
        });
      }
  }
  test(){
    axios.get("http://localhost:8000/getChapterPages/Tensei%20Shitara%20Ken%20Deshita/1").then((response) => {
      console.log(response.data.pages);
      for (let index = 0; index < response.data.pages; index++) {
        let task = RNBackgroundDownloader.download({
          id: 'Tensei-Shitara-Ken-Deshita//1-first-chapter//' + index,
          url: 'http://localhost:8000/public/books/Tensei-Shitara-Ken-Deshita/1-first-chapter/' + index,
          destination: `${RNBackgroundDownloader.directories.documents}/${index}.jpg`
        }).begin((expectedBytes) => {
          //console.log(`Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
          //console.log(`Downloaded: ${percent * 100}%`,index);
        }).done(() => {
          console.log('Download is done!',index);
        }).error((error) => {
          console.log('Download canceled due to error: ', error,index);
        });
      }
    });
   


    // Pause the task
    //task.pause();
    
    // Resume after pause
    //task.resume();
    
    // Cancel the task
    //task.stop();*/
  }
  componentWillMount(){ 
    this.ReAttachingDownloads();
  }
 
  render() {
    // 
    return (
      <MenuProvider>
       <Button title="Test Download" onPress={() => this.test()}/>
        <View style={styles.container}>
          <Layout/>
        </View>
      </MenuProvider>
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
