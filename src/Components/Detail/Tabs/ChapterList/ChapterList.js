import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,ScrollView,Button} from 'react-native';
import Chapter from "./Chapter/Chapter"
import { connect } from 'react-redux'
import {
    loadData,
    saveData,
    setchapterRefs,
    toggleSelectHeader,
    donwloadSelectedChapters,
  } from '../../../../reducers/downloader/downloaderActions'
  import {
    getChaptersFromAPI,
    getChaptersFromLibrary,
    saveChapter,
    saveChapters,
  } from '../../../../reducers/Chapters/Chapters'
import { ENDPOINT } from '../../../../Values/Values';
import Spinner from 'react-native-gifted-spinner';
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
    SaveChapter=(chapter) =>{
        this.props.saveChapter(chapter);
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
        this.setState({ chapters: nextProps.Chapters ,
            Downloads: nextProps.Downloads,
            selectHeaderVisible : nextProps.selectHeaderVisible,
            error : nextProps.ChaptersError,
            loading: nextProps.ChaptersLoading});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.Downloads && nextState.Downloads){
            return nextState.chapters != this.state.chapters || nextState.Downloads.length != this.state.Downloads.length || nextState.selectHeaderVisible != this.state.selectHeaderVisible || nextState.loading != this.state.loading;
        }else{
            return nextState.chapters != this.state.chapters || nextState.selectHeaderVisible != this.state.selectHeaderVisible || nextState.loading != this.state.loading;
        }
    }
    navigateToReader = (chapterIndex,downloaded) =>{
        this.props.screenProps.nav.navigate('Reader',{
            index : chapterIndex,
            downloaded : !downloaded,
            uri: downloaded ? 
                null
                :
                ENDPOINT + "public/books/" + this.props.screenProps.bookID.replace(/[/\\?%*:|"<>. ]/g, '-') + "/"
        })
    }
    isChapterQueued =(chapter)=>{
        let chapterTitle = (chapter.number +"-"+chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        const Downloads = this.state.Downloads ? this.state.Downloads : [];
        for (let index = 0; index < Downloads.length; index++) {
            if(Downloads[index].title === chapterTitle) return true;
        }
        return false;
    }
    componentDidMount(){
        this.props.loadData();
        this.props.getChaptersFromLibrary(this.props.screenProps.bookID);
    }
    render() {
        return (
            <View style={{flex:1}}>
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
                    queued = {this.isChapterQueued(item)}
                    selectHeaderVisible = {this.state.selectHeaderVisible}
                    SaveChapter = {this.SaveChapter}
                 />) 
                 : null
                }
               
            </ScrollView>
            {this.state.chapters || this.state.loading ? null :
                <View style={styles.retryButton}>
                    <Button title="Load Chapters" onPress={() => this.props.getChaptersFromAPI(this.props.screenProps.bookID)} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>
                </View> 
            }
            <View styles={styles.retryButtoncontainer}><Spinner style={styles.Spinner}/></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    retryButtoncontainer:{
        backgroundColor:"red",
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1
    },
    retryButton: {
        width:150,
        height:50,
        position: 'absolute',
        left: (Dimensions.get('window').width / 2) - 75,
        top: (Dimensions.get('window').height / 2) - 75,
    },
    Spinner : {
        position: 'absolute',
        left: (Dimensions.get('window').width / 2),
        top: (Dimensions.get('window').height / 2),
    } 
});
const mapStateToProps = state => {
    return {
        Downloads: state.Downloader.downloads,
        isFetching: state.Downloader.isFetching,
        chapterRefs: state.Downloader.chapterRefs,
        selectHeaderVisible: state.Downloader.selectHeaderVisible,
        Chapters : state.ChaptersReducer.Chapters,
        ChaptersLoading : state.ChaptersReducer.loading,
        ChaptersError : state.ChaptersReducer.error,
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