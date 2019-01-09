import React, { Component } from 'react';
import { StyleSheet, View,TouchableOpacity,Text,Dimensions } from 'react-native';
import Spinner from 'react-native-gifted-spinner';
import ThumbNail from "../../Detail/ThumbNail/ThumbNail"
import RF from "react-native-responsive-fontsize" 
import { ENDPOINT } from '../../../Values/Values';
export default class HistoryItem extends Component  {
    removeFromHistory(){
    }
    resumeReading(){

    }
    render() {
      return (
        <View style={styles.container}>
          <View style={{flex:0.4}}>
            <ThumbNail
              style={{alignSelf:"flex-start"}}
              source={{uri : ENDPOINT + "public/thumbnails/" + this.props.chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') + "_s"}}
            />
          </View>
          <View style={{flexDirection:"column",flex:0.6}}>
            <View style={{flexDirection:"column"}}>
              <Text style={styles.textHeader} numberOfLines={2}>{this.props.chapter.book_id}</Text>
              <Text style={styles.textStyle} numberOfLines={2}>Chapter : {this.props.chapter.number} - {this.props.chapter.title}</Text>
              <Text style={styles.dateStyle} numberOfLines={1}>{this.props.chapter.lastRead} </Text>
            </View>
            <View style={{position: "absolute", bottom: 10, flexDirection:"row",flex: 1}}>
                <TouchableOpacity onPress={this.resumeReading} style={{alignItems:"flex-start",left:30}}>
                  <Text style={styles.resumeStyle}>Resume</Text>
                </TouchableOpacity>
                <View style={{flex:1,alignItems: 'flex-end'}}>
                  <TouchableOpacity onPress={this.removeFromHistory} style={{justifyContent:"flex-end",right:30}}>
                    <Text style={styles.removeStyle}>Remove</Text>
                  </TouchableOpacity>
                </View> 
            </View>
          </View>
        </View>
      )
    }
  
}
const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    height: 200,
    borderColor: '#d6d7da',
    flexDirection:"row",
    margin: 10,
    marginBottom: 0,
  },
  textStyle:{
    fontSize: RF(2),
    color: "black",
    paddingBottom: 10
  },
  textHeader:{
      paddingTop: 8,
      fontWeight: 'bold',
      fontSize: RF(3.5),
      color: "black",
      paddingBottom: 10
  },
  resumeStyle:{
    fontSize: RF(2.5),
    color: "blue",
  },
  removeStyle:{
    fontSize: RF(2.5),
    color: "red",

  },
  dateStyle:{
    fontSize: RF(2.5),
    color: "gray",
    paddingBottom: 10
  },
});
