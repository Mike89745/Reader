import React, { Component } from 'react';
import { StyleSheet,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
export default class LibraryCategoriesModal extends Component {
    state = {
        modalVisible: false,
    }
    showModal(){
        this.setState({ modalVisible: true});
    }
    toggleModal(){
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible});
    }
    Agree=()=>{
        this.props.yes();
        this.toggleModal();
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
                <Text style={[styles.textHeader,{padding:5,paddingBottom:5}]}>{this.props.text}</Text>
                <View style={{flex:1,alignSelf:"flex-end",}}>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => this.toggleModal()} >
                            <Text style={styles.textStyle}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.Agree()}>
                            <Text style={styles.textStyle}>Yes</Text>
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
        paddingBottom: 0,
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        padding: 8,
        paddingBottom: 0,
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});