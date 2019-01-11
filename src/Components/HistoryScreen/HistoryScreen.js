
import React, { Component } from 'react';
import { StyleSheet, ScrollView,} from 'react-native';
import RF from "react-native-responsive-fontsize"
import HistoryItem from './HistoryItem/HistoryItem';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import { ENDPOINT } from '../../Values/Values';
PouchDB.plugin(find)
const ChaptersDB = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
export default class HistoryScreen extends Component {
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
        chapters : []
    } 
    RemoveChapter = (chapter) =>{
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
                console.log(response);
                this.setState({chapters : response.docs});
               // response.docs.length > 0 ? dispatch(gotChapters(GET_CHAPTERS_FROM_LIBRARY,response.docs.sort((a, b) => b.number - a.number))) : null
            }).catch(err => {
                console.log(err);
//                SimpleToast.show("Error getting chapters",SimpleToast.LONG);
            });
        }).catch(err => {
            console.log(err);
//            SimpleToast.show("Error creating chapters indexes",SimpleToast.LONG);
        })
    }  
    componentDidMount(){
        this.loadHistory();
    }
    render() {
        return (
            <ScrollView style={styles.container}>
             {this.state.chapters ? this.state.chapters.map((item,index) => (
               <HistoryItem chapter={item} key={item._id}/>
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