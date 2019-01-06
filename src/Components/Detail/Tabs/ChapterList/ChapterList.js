import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
import RNFS from "react-native-fs";
import { connect } from 'react-redux'
import {
    loadData,
    saveData,
    setchapterRefs,
    toggleSelectHeader,
  } from '../../../../reducers/downloader/downloaderActions'
  import {
    getChaptersFromAPI,
    getChaptersFromLibrary,
    saveChapter,
    saveChapters,
  } from '../../../../reducers/Chapters/Chapters'
import { ENDPOINT } from '../../../../Values/Values';
class ChapterList extends Component {
   
    constructor(props) {
        super(props);
    
        this.state ={
            chapters: null,
            chapterRefs: [],
            Downloads: [],
            selectHeaderVisible : false,
            error : false,
            loading : false,
        }
      }

    onToggleSelect = () =>{
        this.state.selectHeaderVisible ? null: this.props.toggleSelectHeader()
    }
    addRef(ref,index){
        let refs = this.state.chapterRefs
        refs[index] = ref;
        refs.length === this.state.chapters.length ? this.props.setchapterRefs(refs) : null;
        this.setState({chapterRefs: refs});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ chapters: nextProps.props.Chapters,Downloads: nextProps.Downloads,selectHeaderVisible : nextProps.selectHeaderVisible,error : nextProps.ChaptersError,loading: ChaptersLoading});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.Downloads && nextState.Downloads){
            return nextState.chapters != this.state.chapters || nextState.Downloads.length != this.state.Downloads.length || nextState.selectHeaderVisible != this.state.selectHeaderVisible;
        }else{
            return nextState.chapters != this.state.chapters || nextState.selectHeaderVisible != this.state.selectHeaderVisible;
        }
    }
    navigateToReader = (index,downloaded) =>{
        this.props.screenProps.nav.navigate('Reader',{
            title: this.props.screenProps.bookID,
            chapter: this.state.chapters[index].number,
            downloaded : !downloaded,
            ReaderType : this.state.chapters[index].Type ? this.state.chapters[index].Type : null,
            uri: downloaded ? 
                RNFS.DocumentDirectoryPath 
                + "/" + this.props.screenProps.bookID.replace(/[/\\?%*:|"<>. ]/g, '-') 
                + "/" + (this.state.chapters[index].number + "-" + this.state.chapters[index].title).replace(/[/\\?%*:|"<>. ]/g, '-') 
                + "/"
                :
                ENDPOINT + "/public/books/" + this.props.screenProps.bookID.replace(/[/\\?%*:|"<>. ]/g, '-') + "/"
        })
    }
    componentDidMount(){
        this.props.loadData();
        this.props.getChaptersFromLibrary();
    }
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
                {this.state.chapters ? this.state.chapters.map((item,index) => 
                 <Chapter 
                    key={index} 
                    chapter = {item}
                    bookID={this.props.screenProps.bookID}
                    nav = {this.navigateToReader}
                    ref={(chapterRef) => this.addRef(chapterRef,index)}
                    onToggleSelect ={this.onToggleSelect}
                    index = {index}
                    queued = {false}
                    downloading = {false}
                    selectHeaderVisible = {this.state.selectHeaderVisible}
                 />) 
                 : 
                 <Button title="Load Chapters" onPress={() => this.props.getChaptersFromLibrary(this.props.screenProps.bookID)}/>
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
const mapStateToProps = state => {
    return {
        Downloads: state.Downloader.downloads,
        isFetching: state.Downloader.isFetching,
        chapterRefs: state.Downloader.chapterRefs,
        selectHeaderVisible: state.Downloader.selectHeaderVisible,
        Chapters : state.Chapters.Chapters,
        ChaptersLoading : state.Chapters.loading,
        ChaptersError : state.Chapters.error,
    };
};
const mapDispatchToProps = {
    loadData,
    saveData,
    setchapterRefs,
    toggleSelectHeader,
    getChaptersFromAPI,
    getChaptersFromLibrary,
    saveChapter,
    saveChapters,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChapterList);