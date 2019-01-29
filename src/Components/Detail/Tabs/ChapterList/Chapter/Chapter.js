import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableHighlight} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ChapterPopUp from './Menu/Menu';
import RNFS from "react-native-fs";
export default class Chapter extends Component {
    state = {
        downloaded : false,
        selected : false,
        MarkedAsRead : false,
        pages: 0,
        error: false,
        queued: false,
        downloading : false,
    }
    saveChapter = () =>{
        const chapter = this.props.chapter;
        chapter.MarkedAsRead = this.state.MarkedAsRead;
        this.props.SaveChapter(chapter);
    }
    
    getSelect = () =>{
        return this.state.selected;
    }
    getDownloaded = () => {
        return this.state.downloaded;
    }
    select = () =>{
        this.setState({selected: true});
        this.props.onToggleSelect();
    }
    deselect = () =>{
        this.setState({selected: false});
    }
    toggleSelect= () => {
        let selected = this.state.selected;
        this.setState({selected: !selected});
        this.props.onToggleSelect();
    }
    toggleMark = () => {
        let marked = this.state.MarkedAsRead;
        this.setState({MarkedAsRead: !marked},()=>this.saveChapter());
    }
    markAsRead = () => {
        this.setState({MarkedAsRead: true},()=>this.saveChapter());
    }
    unmarkAsRead = () => {
        this.setState({MarkedAsRead: false},()=>this.saveChapter());
    }
    deleteChapter= () =>{
        let title = this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (this.props.chapter.number +"-"+this.props.chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
            this.setState({error: false,downloaded:false});
            alert(`Deleted`);
        }).catch(err => console.log(err,"Delete error"));
    }
    isDownloaded(){
        let title = this.props.chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (this.props.chapter.number +"-"+this.props.chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        let type = this.props.chapter.type;
       
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
            if(response){
                if(type === "IMAGE"){
                    RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
                        this.props.chapter.pages === response.length ? this.setState({downloaded: true,error:false}) : this.setState({error: true,downloaded: false,})
                    }).catch(err =>{
                        this.setState({error: true,downloaded: false})
                    });
                }else{
                    RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}/${chapter}.${type === "PDF" ? "pdf" : type ==="EPUB" ? "epub" : null}`).then(response => {
                        response ? this.setState({downloaded: true,error:false}) : this.setState({error: true,downloaded: false})
                    }).catch(err => {
                        this.setState({error: true,downloaded: false})
                    });
                }
            } 
        }).catch(err => {console.log(err)});
    }
    
    shouldNavigate =()=>{
        if(this.props.selectHeaderVisible){
            this.toggleSelect();
        }else{
            this.props.nav(this.props.index,this.state.downloaded)
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({pages : this.props.chapter.lastPage,MarkedAsRead : this.props.chapter.MarkedAsRead,queued: nextProps.queued,downloading: nextProps.downloading})
    }
    componentWillMount(){
        this.isDownloaded();
    }
    componentDidMount(){
        this.setState({pages : this.props.chapter.lastPage,MarkedAsRead : this.props.chapter.MarkedAsRead})
    }
    render() {
        //#dddddd
        return ( 
            <TouchableHighlight underlayColor="#ccc" onPress={() => this.shouldNavigate()}
                onLongPress={() => this.toggleSelect()}
                delayLongPress={1000}
                >
                <View style={[styles.container,{backgroundColor : this.state.selected ? "#ccc" : this.state.MarkedAsRead ? "#ddd" : null}]} >
                    <View style={{flex:0.8}}>
                        <Text style={styles.textHeader}>Chapter {this.props.chapter.number} - {this.props.chapter.title}</Text>
                        <Text style={styles.textDate}>{this.props.chapter.dateAdded}</Text>
                        {this.props.queued ? <Text>Queued</Text> : this.state.error ? <Text>Error</Text> : this.state.downloaded ? <Text>Downloaded</Text> : null}
                        {this.state.pages > 1 ? <Text style={styles.textDate}>page: {this.state.pages}</Text> : null}
                    </View>
                    <View style={{flex:0.2,alignItems:"flex-end",}}>
                        <ChapterPopUp chapter={this.props.chapter} delete={this.deleteChapter} markAsRead={this.toggleMark}/>
                    </View>
                </View>
            </TouchableHighlight>
        ) 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#d6d7da',
        paddingLeft : 5,
        paddingRight : 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2),
        paddingBottom: 3,
        paddingTop: 3,  
    },
    textDate:{
        fontSize: RF(1.5),
        paddingBottom: 3,
    },
   
});
