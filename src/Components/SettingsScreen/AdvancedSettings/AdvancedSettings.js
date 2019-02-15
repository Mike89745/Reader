import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize";
import AreYouSureModal from "../../Modals/AreYouSureModal"
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import SimpleToast from '../../../node_modules/react-native-simple-toast';
PouchDB.plugin(find);
const Library = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
const Chapters = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
const CategoriesDB = new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
/**
 * Pokročilá nastavení aplikace.
 */
export default class AdvancedSettings extends Component {
    /**
     * Smaže lokální databáze Library,Chapters a Categories.
     */
    deleteDBs=()=>{
        Library.destroy().then(res =>{
            Chapters.destroy().then(res => {
                CategoriesDB.destroy().then(res =>{
                    new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
                    new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
                    new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
                }).catch(err=> SimpleToast.show("Error deleting Library!",SimpleToast.LONG))
            }).catch(err=> SimpleToast.show("Error deleting Chapters!",SimpleToast.LONG))
        }).catch(err=> SimpleToast.show("Error deleting Categories!",SimpleToast.LONG));
       
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textHeader}>Advanced Settings</Text>
                <View style={{padding:5,flexDirection:"row"}}>
                    <Text style={styles.textStyle}>Delete all Books and chapters</Text>
                    <View style={{flex:0.5,alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={() => this.Modal.showModal()} >
                            <Text style={{  fontSize: RF(2.75),color: "#3b424c",flex: 1,padding: 15,}}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <AreYouSureModal yes={this.deleteDBs} text="Are you sure you want to delete your Library?" ref={(ref) => this.Modal = ref}/>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"column",
        borderBottomWidth:1,
        borderBottomColor:"#ccc"
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        flex: 1,
        padding: 15,
    },
    textHeader:{
        padding: 8,
        fontWeight: 'bold',
        fontSize: RF(2.75),
        color: "#3b424c"
    }
});