import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize";
import RNPickerSelect from 'react-native-picker-select';
export default class ReaderSettings extends Component {
    state = {
        ReaderSettings: "Scroll",
        ReaderSettingsItems: [
            {label:"Scroll", value : "Scroll"},
            {label:"Left to Right", value : "H"},
            {label:"Right to Left", value : "Hrtl"},
        ],
       
    }
    saveSettings(value,key){
        this.setState({ReaderSettings: value,});
        this.props.ReduxSaveSettings(value,key);
    }
    componentDidMount(){
        this.setState({ReaderSettings:this.props.ReaderSettings,});
    }
    componentWillReceiveProps(nextProps){
        this.setState({ReaderSettings:nextProps.ReaderSettings,});
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.ReaderSettings != this.state.ReaderSettings
    }
    render() {
        return (
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
                        onValueChange={(value) => {this.saveSettings(value,"ReaderLayout")}}
                        style={pickerSelectStyles.inputAndroid}
                        value={this.state.ReaderSettings}
                        hideIcon={true}
                    />
                </View>
            
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
        fontSize: RF(3.5),
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