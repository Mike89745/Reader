import React, { Component } from 'react';
import { StyleSheet, Picker,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
export default class ReaderSettingsModal extends Component {
    state = {
        modalVisible: false,
        viewerLayout: null,
    }
    SaveSettings=()=>{
        this.setState({ modalVisible: false });
        this.props.ChangeSettings(this.state.viewerLayout);
    }
    toggleModal(){
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible });
    }
    componentWillReceiveProps(nextProps) {
       this.state.modalVisible != nextProps.settingsVisible ? this.setState({ modalVisible: nextProps.settingsVisible}) : null;  
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
                <Text style={[styles.textHeader,{padding:5,paddingBottom:10}]}>Settings</Text>
                <View style={{flex: 1, flexWrap: 'wrap',flexDirection: "row",}}>
                    <Text style={[styles.textStyle,{flex: 0.5, height: 50,justifyContent:"center" }]} >Viewer layout</Text>
                    <Picker style={[styles.textStyle,{backgroundColor:"white"}]}
                        selectedValue={this.state.viewerLayout}
                        style={{flex: 0.5,height: 50 }}
                        mode={"dropdown"}
                        onValueChange={(itemValue, itemIndex) => this.setState({viewerLayout: itemValue})}>
                        <Picker.Item style={styles.textStyle} label="Scroll" value="Scroll" />
                        <Picker.Item style={styles.textStyle} label="Left to Right" value="H" />
                        <Picker.Item style={styles.textStyle} label="Right to Left" value="Hrtl" />
                    </Picker>
                </View>
                <View style={{flex:1,alignSelf:"flex-end",}}>
                    <TouchableOpacity onPress={this.SaveSettings} style={{alignSelf:"flex-end"}}>
                        <Text style={styles.textStyle}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:8,
        backgroundColor: "#3b424c", 
        width:Math.round(Dimensions.get("screen").width*0.75),
        height:Math.round(Dimensions.get("screen").height*0.50), 
        alignSelf:"center",
        padding: 10,
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "white"
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "white"
    }
});