import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../Icon/Icon';
import RNPickerSelect from 'react-native-picker-select';
export default class GeneralSettings extends Component {
    state = {
        StartScreenSettings: "Library",
        StartScreenItems: [
            {label:"Library", value : "Library"},
            {label:"Catalog", value : "Catalog"},
            {label:"History", value : "History"},
            {label:"Downloads", value : "Downloads"}
        ],
        LibraryLayoutSettings : "Default",
        LibraryLayoutItems :  [
            {label:"Default", value : "Default"},
            {label:"1", value : "1"},
            {label:"2", value : "2"},
            {label:"3", value : "3"},
            {label:"4", value : "4"},
            {label:"5", value : "5"},
            {label:"6", value : "6"},
            {label:"7", value : "7"},
            {label:"8", value : "8"},
        ],
    }
  
    saveStartScreen(value,key){
        this.setState({
            StartScreenSettings: value,
        });
        this.props.ReduxSaveSettings(value,key);
    }
    saveLibraryLayoutSettings(value,key){
        this.setState({
            LibraryLayoutSettings: value,
        });
        this.props.ReduxSaveSettings(value,key);
    }
    componentDidMount(){
        this.setState({
            LibraryLayoutSettings:this.props.LibraryLayoutSettings,
            StartScreenSettings:this.props.StartScreenSettings
            
        });
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            LibraryLayoutSettings:nextProps.LibraryLayoutSettings,
            StartScreenSettings:nextProps.StartScreenSettings
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.LibraryLayoutSettings != this.state.LibraryLayoutSettings || nextState.StartScreenSettings != this.state.StartScreenSettings 
    }
    render() {
        return (
            <View style={styles.container}>
              <Text style={styles.textHeader}>General Settings</Text>
                <View style={{padding:15}}>
                    <Text>Start Screen</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Select Start Screen...',
                            value: null,
                            color: '#9EA0A4',
                        }}
                        items={this.state.StartScreenItems}
                        onValueChange={(value) => {
                            this.saveStartScreen(value,"StartScreen")
                        }}
                        style={pickerSelectStyles.inputAndroid}
                        value={this.state.StartScreenSettings}
                        hideIcon={true}
                    />
                </View>
                <View style={{padding:15}}>
                    <Text>Library books per row</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Books per row...',
                            value: null,
                            color: '#9EA0A4',
                        }}
                        items={this.state.LibraryLayoutItems}
                        onValueChange={(value) => {
                            this.saveLibraryLayoutSettings(value,"LibraryLayoutSettings")
                        }}
                        style={pickerSelectStyles.inputAndroid}
                        value={this.state.LibraryLayoutSettings}
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
    inputAndroid: {
        fontSize: RF(2.5),
        paddingTop: 5,
        paddingBottom: 5,
        color: 'black',
        borderTopWidth: 0
    },
});