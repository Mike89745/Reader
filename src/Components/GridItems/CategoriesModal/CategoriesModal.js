import React, { Component } from 'react';
import { StyleSheet,Dimensions,View,FlatList,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
import CheckBox from './Checkbox/CheckBox';
import PouchDB from 'pouchdb-adapters-rn';
const Library = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
const CategoriesDB = new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
/**
 * Modal zobrazující všechny kategorie a vybrané kategorie vybrané knihy.
 */
export default class CategoriesModal extends Component {
    state = {
        modalVisible: false,
        categories: [],
        CheckBoxRefs: [],
        CheckedCategories : [],
    }
    /**
     * Najde vybrané kategorie projdutím polem CheckBoxRefs a voláním na metodu reference isChecked, 
     * pokud vrátí true přidá do pole kategorií ID kategorie voláním na metodu reference getID. 
     * Poté kategorie uloží.
     */
    SaveCategories=()=>{
        if(this.props.Book && this.state.modalVisible){
            let categories = []
            this.state.CheckBoxRefs.map(ref =>{
                if(ref.isChecked()) categories.push(ref.getID());
            });
            Library.get(this.props.Book).then(res =>{
                res.categories = categories;
                return Library.put(res).then(res => {
                    console.log(res);
                }).catch(err => console.log(err,"failed to update"));
            }).catch(err => console.log(err,"err")); 
           
        }
        if(this.state.modalVisible) this.toggleModal();
    }
    /**
     * Zobrazí nebo skryje modal, podle toho zda-li je zobrazen nebo ne.
     */
    toggleModal = () =>{
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible });
        if(modalVisible){
            this.setState({currentCategories : []});
        }
    }
    /**
     * Přidá CheckBox referenci do pole CheckBoxRefs .
     * @param {*} ref Reference na Komponent
     * @param {*} index Index kam se má do pole CheckBoxRefs přidat.
     */
    addRef(ref,index){
        let refs = this.state.CheckBoxRefs
        refs[index] = ref;
        this.setState({CheckBoxRefs: refs});
    }
    /**
     * Načte všechny kategorie z lokální databáze.
     */
    loadCategories(){
        CategoriesDB.allDocs().then(res =>{
            res.rows.map(doc => console.log(doc));
            this.setState({categories:res.rows});
        }).catch(err => console.log(err,"categories err"));
    }
    /**
     * Načte všechny kategorie a nastaví prop currentCategories na state prop CheckedCategories.
     */
    componentDidMount() {
        this.loadCategories()
        this.setState({CheckedCategories:this.props.currentCategories});
    }
    /**
     * Nastaví prop currentCategories na state prop CheckedCategories.
     */
    componentWillReceiveProps(NextProps){
        this.setState({CheckedCategories:NextProps.currentCategories});
    }
    /**
     * Kontroluje jestli se kategorie změnily.
     */
    shouldComponentUpdate(NextState,NextProps){
        if(NextProps.currentCategories){
            return true
        }
        if(!this.state.categories && NextState.categories){
            return true
        }
        else if(!NextState.categories && this.state.categories){
            return true
        }
        else if(this.state.categories && NextState.categories){
            return this.state.categories.length != NextState.categories.length 
        }
        
    }
    render() {
        return (
        <Modal
            animationIn="zoomIn"
            animationOut="zoomOut"
            isVisible={this.state.modalVisible}
            onBackdropPress={() => this.setState({ modalVisible: false })}
            useNativeDriver={true}
        >
         <View style={styles.container}>
            <Text style={[styles.textHeader,{padding:5,paddingBottom:10}]}>Select Categories</Text>
            <FlatList 
                    data={this.state.categories}
                    renderItem={({item,index}) => 
                    <CheckBox 
                        isChecked={this.state.CheckedCategories ? this.state.CheckedCategories.includes(item.id) : false} 
                        text={item.id} 
                        ref={(CheckBoxRef) => this.addRef(CheckBoxRef,index)}/>}
                    />
            
                <View style={{alignSelf:"flex-end",}}>
                    <TouchableOpacity onPress={this.SaveSettings} style={{alignSelf:"flex-end"}} onPress={() => this.SaveCategories()}>
                        <Text style={[styles.textStyle,{padding: 10}]}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:3,
        backgroundColor: "#fff", 
        width:Math.round(Dimensions.get("screen").width*0.75),
        height:Math.round(Dimensions.get("screen").height*0.75),
        alignSelf:"center",
        padding: 10,
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black"
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});