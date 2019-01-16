import React, { Component } from 'react';
import { StyleSheet,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
import * as Progress from 'react-native-progress';
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
                <Text style={[styles.textHeader,{padding:5,paddingBottom:10}]}>{this.props.text}</Text>
                <View style={{flexDirection : "row",flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}}>
                    <Progress.Bar
                        height={12}
                        width={Dimensions.get("screen").width - 65}
                        progress={this.state.percentage}
                        useNativeDriver={true}
                    />
                    <Text style={{textAlign:"right",paddingRight:15, paddingLeft:15}}>{this.state.value ? this.state.value : 0}/{this.state.maxValue}</Text>
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
        padding: 8
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});