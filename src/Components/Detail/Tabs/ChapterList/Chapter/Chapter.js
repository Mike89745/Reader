import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableHighlight} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ChapterPopUp from './Menu/Menu';
import RNFS from "react-native-fs";
/**
 * Jedna zobrazená kapitola v ChapterListu.
 */
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
    /**
     * Změní kapitoly atribut MarkedAsRead na stávající state MarkedAsRead a zavolá metodu prop SaveChapter.
     */
    saveChapter = () =>{
        const chapter = this.props.chapter;
        chapter.MarkedAsRead = this.state.MarkedAsRead;
        this.props.SaveChapter(chapter);
    }
    /**
     * Vrací state selected
     */
    getSelect = () =>{
        return this.state.selected;
    }
    /**
     * Vrací state Downloaded
     */
    getDownloaded = () => {
        return this.state.downloaded;
    }
    /**
     * Nastaví state selected na true.
     */
    select = () =>{
        this.setState({selected: true});
        this.props.onToggleSelect();
    }
    /**
     * Nastaví state selected na false.
     */
    deselect = () =>{
        this.setState({selected: false});
    }
    /**
     * Nastaví state selected na na jeho opak. Pokud true tak na false.
     */
    toggleSelect= () => {
        let selected = this.state.selected;
        this.setState({selected: !selected});
        this.props.onToggleSelect();
    }
    /**
     * Nastaví state MarkedAsRead na na jeho opak. Pokud true tak na false.
     */
    toggleMark = () => {
        let marked = this.state.MarkedAsRead;
        this.setState({MarkedAsRead: !marked},()=>this.saveChapter());
    }
    /**
     * Nastaví state MarkedAsRead na true.
     */
    markAsRead = () => {
        this.setState({MarkedAsRead: true},()=>this.saveChapter());
    }
    /**
     * Nastaví state MarkedAsRead na false.
     */
    unmarkAsRead = () => {
        this.setState({MarkedAsRead: false},()=>this.saveChapter());
    }
    /**
     * Smaže kapitolu z zařízení
     */
    deleteChapter= () =>{
        let title = this.props.bookID.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (this.props.chapter.number +"-"+this.props.chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
            this.setState({error: false,downloaded:false});
            alert(`Deleted`);
        }).catch(err => console.log(err,"Delete error"));
    }
    /**
     * Kontroluje jestli existuje složka pro kapitolu pokud ano tak zkontroluje jestli má stejní počet souborů jako počet stránek. 
     * Podle toho nastaví state error a downloaded.
     */
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
    /**
     * Zda-li má se má otevřít Reader, zavolat prop metodu nav (navigateToReader), nebo označit komponent (selected = true).
     */
    shouldNavigate =()=>{
        if(this.props.selectHeaderVisible){
            this.toggleSelect();
        }else{
            this.props.nav(this.props.index,this.state.downloaded)
        }
    }
    /**
     * Nastaví změněné props na state props.
     */
    componentWillReceiveProps(nextProps){
        this.setState({pages : this.props.chapter.lastPage,MarkedAsRead : this.props.chapter.MarkedAsRead,queued: nextProps.queued,downloading: nextProps.downloading})
    }
    /**
     * Zavolá metodu is Downloaded.
     */
    componentWillMount(){
        this.isDownloaded();
    }
    /**
     * Nastaví měnitelné props na state props.
     */
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
