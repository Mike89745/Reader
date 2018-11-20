import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
import axios from 'react-native-axios';
export default class ChapterList extends Component {
    state ={
        chapters: null,
    }
    getChapters(){
        axios.get('http://localhost:8000/getChapters/XD').then((response) => {
            this.setState({chapters:response.data.docs});
        });
    }
    componentDidMount(){
      //  console.log(this.props._id);
        //console.log(this.scre);
    }
    
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
                {this.state.chapters ? this.state.chapters.map((item,index) => 
                 <Chapter key={index} chapterName={item.title} chapterCount={item.number} dateAdded={item.dateAdded}/>) 
                 : 
                 <Button title="Load Chapters" onPress={() => this.getChapters()}/>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
   
});