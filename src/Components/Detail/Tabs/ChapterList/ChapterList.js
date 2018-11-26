import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
import axios from 'react-native-axios';
export default class ChapterList extends Component {
    state ={
        chapters: null,
    }
    donwloadSelectedChapters(){

    }
    onSelect(){

    }
    onDeselect(){
        
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ chapters: nextProps.screenProps.chapters});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.chapters != this.state.chapters;
    }
    componentDidMount(){
        //console.log(this.props.screenProps.bookID);
        //console.log(this.scre);
    }
    
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
                {this.state.chapters ? this.state.chapters.map((item,index) => 
                 <Chapter key={index} 
                 chapterName={item.title} 
                 chapterCount={item.number} 
                 dateAdded={item.dateAdded} 
                 bookID={this.props.screenProps.bookID}
                 nav = {this.props.screenProps.nav}
                 />) 
                 : 
                 <Button title="Load Chapters" onPress={() => this.props.screenProps.getChapters()}/>
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