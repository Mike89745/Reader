import React, { Component } from 'react';
import { StyleSheet,Dimensions,View,FlatList,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
import CheckBox from './Checkbox/CheckBox';
import PouchDB from 'pouchdb-react-native';
const Library = new PouchDB('Library');
const CategoriesDB = new PouchDB('categories');
export default class CategoriesModal extends Component {
    state = {
        modalVisible: false,
        categories: [],
        CheckBoxRefs: [],
        currentCategories: [],
    }
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
    toggleModal = () =>{
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible });
        if(modalVisible){
            this.setState({currentCategories : []});
        }
    }
    addRef(ref,index){
        let refs = this.state.CheckBoxRefs
        refs[index] = ref;
        this.setState({CheckBoxRefs: refs});
    }
    loadCategories(){
        CategoriesDB.allDocs().then(res =>{
            res.rows.map(doc => console.log(doc));
            this.setState({categories:res.rows});
        }).catch(err => console.log(err,"categories err"));
    }
    componentDidMount() {
        this.loadCategories()
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
                        isChecked={false} 
                        text={item.doc._id} 
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