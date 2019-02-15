import React, { Component } from 'react';
import { StyleSheet, TextInput,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
export default class LibraryCategoriesModal extends Component {
    state = {
        modalVisible: false,
        CategoryName: ""    
    }
    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    addCategory(){
        this.state.CategoryName === null || this.state.CategoryName.match(/^ *$/) !== null ? null : this.props.addCategory(this.state.CategoryName);;
        this.toggleModal();
    }
    toggleModal(){
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible,CategoryName:" "});
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
                <Text style={[styles.textHeader,{padding:5,paddingBottom:10}]}>Add category</Text>
                <View style={{flex: 1, flexWrap: 'wrap',}}>
                    <TextInput
                        style={{height: 40, borderBottomColor: '#3b424c',borderBottomWidth: 2,marginLeft: 10,marginRight:25,width:150}}
                        onChangeText={(CategoryName) => this.setState({CategoryName})}
                        value={this.state.text}
                        placeholder="Category Name"
                    />
                </View>
                <View style={{flex:1,alignSelf:"flex-end",}}>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => this.toggleModal()} >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.addCategory()}>
                            <Text style={styles.textStyle}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:8,
        backgroundColor: "#fff",
        height: 150, 
        width:Math.round(Dimensions.get("screen").width*0.75),
        alignSelf:"center",
        padding: 10,
        
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        padding: 8
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});