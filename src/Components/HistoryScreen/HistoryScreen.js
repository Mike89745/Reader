
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
/**
 * Obrazovka zobrazující historii čtení
 */
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
    /**
     * Metoda volaná při zavolání eventu reRender. Znovu načte historii pomocí metody loadHistory a nastaví state prop udate na false.
     */
    RefreshComponent =() =>{
        this.setState({chapters : [], chapterToLoad: null,update : false},() => this.loadHistory());
    }
    /**
     * Zabraňuje nekonečnému načítání Readeru.
     */
    componentWillReceiveProps(nextProps){
        this.state.update ? null : this.resumeReading();
        this.setState({update : true});
    }
    /**
     * Otevře Reader na s vybranou kapitolou.
     */
    resumeReading =() =>{
        const chapter = this.state.chapterToLoad;
        if(chapter){
            this.props.getChaptersFromLibrary(chapter.book_id);
            const chapterIndex = this.props.Chapters.findIndex(x => x._id == chapter._id)
            this.props.navigation.navigate('Reader',{
                index : chapterIndex,
                refresh : this.RefreshComponent
            });
        }
    }
    /**
     * Před otevřením Readeru načte všechny kapitoly daného titulu.
     * @param {*} chapter  daná kapitola
     */
    LoadBookChapters =(chapter)=>{
        this.setState({chapterToLoad : chapter});
        this.props.getChaptersFromLibrary(chapter.book_id);
    } 
    /**
     * Vyresetuje kapitolu, smaže lastRead datum a lastPage, uloží ji zpátky do lokální databáze a Odebere jí z aktuálně načtených kapitol (state prop Chapters).
     * @param {*} chapter  daná kapitola
     */
    RemoveChapter = (chapter) =>{
        let chapters =  this.state.chapters
        const chapterIndex = chapters.findIndex(x => x._id == chapter._id);
        chapters.splice(chapterIndex,1);
        this.setState({chapters : chapters});
        chapter.lastRead = null;
        chapter.lastPage = 0;
        ChaptersDB.put(chapter).then(res => {}).catch(err => {console.log(err)})
    }
    /**
     * Načte posledních 10 čteních kapitol z lokální databáze.
     */
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
    /**
     * Otevře Detail vybrané knihy.
     * @param {*} chapter  daná kapitola
     */
    NavigateToDetail=(chapter)=>{
        this.props.navigation.navigate('Details',{_id : chapter.book_id})
    }
    /**
     * Načte historii pomocí metody loadHistory.
     */
    componentDidMount(){
        this.loadHistory();
    }
    /**
     * Odebere Listener reRender.
     */
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
        Chapters : state.ChaptersReducer.Chapters,
    };
};
const mapDispatchToProps = {
    getChaptersFromLibrary,
};
export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);