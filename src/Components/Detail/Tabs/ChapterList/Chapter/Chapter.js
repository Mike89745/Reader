import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableHighlight,NetInfo} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ChapterPopUp from './Menu/Menu';
import RNFS from "react-native-fs";
import SimpleToast from '../../../../../../node_modules/react-native-simple-toast';
export default class Chapter extends Component {
    state = {
        downloaded : false,
        selected : false,
        MarkedAsRead : false,
        pages: 0,
        error: false,
        queued: false,
    }
    getPages = () => {
        return this.state.pages;
    }
    getSelect = () =>{
        return this.state.selected;
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
        this.setState({MarkedAsRead: marked});
    }
    markAsRead = () => {
        this.setState({MarkedAsRead: true});
    }
    unmarkAsRead = () => {
        this.setState({MarkedAsRead: false});
    }
    deleteChapter= () =>{
        let title = this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (this.props.chapterCount +"-"+this.props.chapterName).replace(/[/\\?%*:|"<>. ]/g, '-');
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
            this.setState({error: false,downloaded:false});
            alert(`Deleted`);
        }).catch(err => console.log(err,"Delete error"));
    }
   
    isDownloaded(){
        let title = this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (this.props.chapterCount +"-"+this.props.chapterName).replace(/[/\\?%*:|"<>. ]/g, '-');
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
           if(response) RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
              this.state.pages > 0 ? this.state.pages === response.length ? this.setState({downloaded: true,error:false}) : this.setState({error: true,downloaded: false,}) : null;
           })
        });
    }
    shouldNavigate =()=>{
        console.log(this.props.selectHeaderVisible);
        if(this.props.selectHeaderVisible){
            this.toggleSelect();
        }else{
            this.props.nav.navigate('Reader',{
                title: this.props.bookID,
                chapter: this.props.chapterCount,
                downloaded : !this.state.downloaded,
                uri: this.state.downloaded ? 
                RNFS.DocumentDirectoryPath +"/"+ this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" + (this.props.chapterCount +"-"+this.props.chapterName).replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                :
                "http://localhost:8000/public/books/" + this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-') + "/"
            })
        }
    }
    componentDidMount(){
        fetch("http://localhost:8000/getChapterPages/"+ this.props.bookID + "/" + this.props.chapterCount).then(response =>{
            return response.json()
        }).then((response) => {
            this.setState({pages : response.pages},() => this.isDownloaded())
        }).catch(error =>{
            SimpleToast.show("Error getting chapter pages, please Try again",SimpleToast.LONG);
            console.log(error);
        });
    }
    render() {
        //#dddddd
        return ( 
            <TouchableHighlight underlayColor="#ccc" onPress={() => this.shouldNavigate()}
                onLongPress={() => this.toggleSelect()}
                delayLongPress={1000}
                >
                <View style={[styles.container,{backgroundColor : this.state.selected ? "#ccc" : this.state.markAsRead ? "#ddd" : null}]} >
                    <View style={{flex:0.8}}>
                        <Text style={styles.textHeader}>Chapter {this.props.chapterCount} - {this.props.chapterName}</Text>
                        <Text style={styles.textDate}>{this.props.dateAdded}</Text>
                        {this.props.queued ? <Text>Queued</Text> : this.state.error ? <Text>Error</Text> : this.state.downloaded ? <Text>Downloaded</Text> : null}
                    </View>
                    <View style={{flex:0.2,alignItems:"flex-end",}}>
                        <ChapterPopUp download={this.DownloadChapter} delete={this.DeleteChapter} markAsRead={this.toggleMark}/>
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
