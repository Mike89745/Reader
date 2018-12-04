import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
import RNFS from "react-native-fs";
import { connect } from 'react-redux'
import {
    loadData,
    saveData,
  } from '../../../../reducers/downloader/downloaderActions'
class ChapterList extends Component {
   
    constructor(props) {
        super(props);
    
        this. state ={
            chapters: null,
            chapterRefs: [],
            selectedCount: 0,
            Downloads: [],
        }
      }
    donwloadSelectedChapters = () =>{
        let queueData = this.state.Downloads;
        if(!queueData) queueData = []; 
        this.state.chapterRefs.forEach(ref => {
            if(ref.getSelect()){
                let title = ref.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
                let chapter = (ref.props.chapterCount +"-"+ref.props.chapterName).replace(/[/\\?%*:|"<>. ]/g, '-');
                
                RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title).then(response => {
                    if(!response) {
                        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title);
                    }
                });
                RNFS.exists(RNFS.DocumentDirectoryPath + "/" + title + "/" + chapter).then(response => {
                    if(!response) {
                        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + title+ "/" + chapter);
                    }
                });
                let pages = [];
                for (let index = 0; index < ref.getPages(); index++) {
                    pages.push({status: 0});
                }
                queueData.push({
                    title : title,
                    chapter: chapter,
                    pageStatus : pages,
                });
            }
        });
        this.props.saveData(queueData);
    }

    deleteSelectedChapters = () =>{
        this.state.chapterRefs.forEach(ref => {
            if(ref.getSelect())  ref.DeleteChapter();
        });
    }
    toggleMarkSelectedChapters = () =>{
        this.state.chapterRefs.forEach(ref => {
            if(ref.getSelect()) ref.toggleMark();
        });
    }
    DeselectAll = () =>{
        this.state.chapterRefs.forEach(ref => {
            ref.deselect();
        });
    }
    SelectAll= () =>{
        this.state.chapterRefs.forEach(ref => {
            ref.select();
        });
    }
    onToggleSelect = (index) =>{
        let count = this.state.selectedCount;
        this.state.chapterRefs[index].toggleSelect() ? count++ : count--;
        this.setState({selectedCount : count});
    }
    addRef(ref){
        let refs = this.state.chapterRefs
        refs.push(ref);
        this.setState({chapterRefs: refs});
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.screenProps.chapters);
        this.setState({ chapters: nextProps.screenProps.chapters,Downloads: nextProps.Downloads});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.Downloads && nextState.Downloads){
            return nextState.chapters != this.state.chapters || nextState.Downloads.length != this.state.Downloads.length;
        }else{
            return nextState.chapters != this.state.chapters;
        }
    }
    componentDidMount(){
        this.props.loadData();
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
                 ref={(chapterRef) => this.addRef(chapterRef)}
                 select ={this.onToggleSelect}
                 index = {index}
                 queued = {false}
                 pages = {item.pages ? item.pages : 0}
                 />) 
                 : 
                 <Button title="Load Chapters" onPress={() => this.props.screenProps.getChapters()}/>
                }
                 <Button title="Download Chapters" onPress={() => this.donwloadSelectedChapters()}/>
                 <Button title="Select All Chapters" onPress={() => this.SelectAll()}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
   
});
const mapStateToProps = state => {
    return {
        Downloads: state.downloads.downloads,
        isFetching: state.downloads.isFetching,
        res: state.downloads.res,
    };
};
const mapDispatchToProps = {
    loadData,
    saveData,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChapterList);