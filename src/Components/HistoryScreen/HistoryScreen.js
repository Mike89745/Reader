
import React, { Component } from 'react';
import { StyleSheet, ScrollView,} from 'react-native';
import RF from "react-native-responsive-fontsize"
import HistoryItem from './HistoryItem/HistoryItem';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import { ENDPOINT } from '../../Values/Values';
import { connect } from 'react-redux';
import {getChaptersFromLibrary} from "../../reducers/Chapters/Chapters"
import RNFS from "react-native-fs";
PouchDB.plugin(find)
const ChaptersDB = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
class HistoryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ToggleMainDrawerButton/>
            ),
            drawerLockMode: 'locked-closed',
        };
      };
    state = {
        chapters : [],
        chapterToLoad : null,
        update : false,
    }
    reRender = this.props.navigation.addListener('willFocus', () => {
        this.RefreshComponent();
    });
    RefreshComponent =() =>{
        this.setState({chapters : [], chapterToLoad: null,update : false},() => this.loadHistory());
    }
    isDownloaded=(chapter)=>{
        let title =chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapterTitle = (chapter.number +"-"+chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        return RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapterTitle}`).then(response => {
            if(response) RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${title}/${chapterTitle}`).then(response => {
               chapter.pages === response.length ? isDownloaded = true : isDownloaded = false;
               if( chapter.pages === response.length){
                    return true
               }else{
                    return false
               }
            })
            return false
        }).catch(err => {console.log(err)});
      }
      componentWillReceiveProps(nextProps){
        
        this.state.update ? null : this.resumeReading();
        this.setState({update : true});
      }
      resumeReading =() =>{
        const chapter = this.state.chapterToLoad;
        if(chapter){
            this.props.getChaptersFromLibrary(chapter.book_id);
            this.isDownloaded(chapter).then(downloaded => {
                const chapterIndex = this.props.Chapters.findIndex(x => x._id == chapter._id)
                this.props.navigation.navigate('Reader',{
                    index : chapterIndex,
                    downloaded : !downloaded,
                    uri: downloaded ? 
                        null
                        :
                        ENDPOINT + "public/books/" + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') + "/",
                    refresh : this.RefreshComponent
                })
            }).catch(err => console.log(err));
        }
    }
    LoadBookChapters =(chapter)=>{
        this.setState({chapterToLoad : chapter});
        this.props.getChaptersFromLibrary(chapter.book_id);
    } 
    RemoveChapter = (chapter) =>{
        let chapters =  this.state.chapters
        const chapterIndex = chapters.findIndex(x => x._id == chapter._id);
        chapters.splice(chapterIndex,1);
        this.setState({chapters : chapters});
        chapter.lastRead = null;
        ChaptersDB.put(chapter).then(res => {}).catch(err => {console.log(err)})
    }
    loadHistory = () =>{
        ChaptersDB.createIndex({
            index: {
                fields: ['book_id']
            }
        }).then(() => {
            return ChaptersDB.find({
                selector: {
                  lastRead : {$ne : null},
                },
                limit : 10,
            }).then(response => {
                this.setState({chapters : response.docs});
            }).catch(err => {
//                SimpleToast.show("Error getting chapters",SimpleToast.LONG);
            });
        }).catch(err => {
//            SimpleToast.show("Error creating chapters indexes",SimpleToast.LONG);
        })
    }  
    NavigateToDetail=(chapter)=>{
        console.log(chapter.book_id);
        this.props.navigation.navigate('Details',{_id : chapter.book_id})
    }
    componentDidMount(){
        this.loadHistory();
    }
    componentWillUnmount(){
        this.reRender;
    }
    render() {
        return (
            <ScrollView style={styles.container}>
             {this.state.chapters ? this.state.chapters.map((item,index) => (
               <HistoryItem chapter={item} key={item._id} removeChapter={this.RemoveChapter} resumeReading = {this.LoadBookChapters} NavigateToDetail={this.NavigateToDetail}/>
             ))
            :null}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});
const mapStateToProps = state => {
    return {
        selectHeaderVisible: state.Downloader.selectHeaderVisible,
        Chapters : state.ChaptersReducer.Chapters,
    };
};
const mapDispatchToProps = {
    getChaptersFromLibrary,
    
};
export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);