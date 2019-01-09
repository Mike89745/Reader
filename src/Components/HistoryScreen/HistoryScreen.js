
import React, { Component } from 'react';
import { StyleSheet, ScrollView,} from 'react-native';
import RF from "react-native-responsive-fontsize"
import HistoryItem from './HistoryItem/HistoryItem';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import PouchDB from 'pouchdb-react-native';
import find from 'pouchdb-find';
import { ENDPOINT } from '../../Values/Values';
PouchDB.plugin(find)
const ChaptersDB = new PouchDB('Chapters');
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
        ChaptersDB.allDocs({limit : 10,endkey: '_design'}).then(res => {
            this.setState({chapters : res.rows})
        })
    }  
    componentDidMount(){
        this.loadHistory();
    }
    render() {
        return (
            <ScrollView style={styles.container}>
             {this.state.chapters ? this.state.chapters.map((item,index) => (
               <HistoryItem chapter={item.doc}/>
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