import React, { Component } from 'react';
import { StyleSheet, Picker,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
import RNPickerSelect from 'react-native-picker-select';

export default class ReaderSettingsModal extends Component {
    state = {
        modalVisible: false,
        ReaderSettings: "Scroll",
        ReaderSettingsItems: [
            {label:"Scroll", value : "Scroll"},
            {label:"Left to Right", value : "H"},
            {label:"Right to Left", value : "Hrtl"},
        ],
    }
    saveSettings=(value)=>{
        this.setState({
            ReaderSettings: value,
        });
        this.setState({ modalVisible: false });
        this.props.ChangeSettings(value);
    }
    toggleModal=()=>{
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible });
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
              <Text style={styles.textHeader}>Reader Settings</Text>
                <View style={{padding:15}}>
                    <Text>Reader layout</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Select reader layout...',
                            value: null,
                            color: '#9EA0A4',
                        }}
                        items={this.state.ReaderSettingsItems}
                        onValueChange={(value) => {this.saveSettings(value)}}
                        style={pickerSelectStyles.inputAndroid}
                        value={this.state.ReaderSettings}
                        hideIcon={true}
                    />
                </View>
                <TouchableOpacity onPress={() => this.toggleModal()} style={{alignSelf:"flex-end"}}>
                    <Text style={styles.textStyle}>OK</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:8,
        backgroundColor: "#FFF", 
        width:Math.round(Dimensions.get("screen").width*0.75),
        height: 175,
        alignSelf:"center",
        padding: 10,
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
    }
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: RF(3.5),
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        color: 'black',
    },
    inputAndroid: {
        fontSize: RF(3.5),
        paddingTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 5,
        color: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        borderTopWidth: 0,
    },
});
