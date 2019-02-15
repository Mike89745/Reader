import React, { Component } from 'react';
import { StyleSheet, View, Text,Switch} from 'react-native';
import RF from "react-native-responsive-fontsize"
export default class DownloaderSettings extends Component {
    state = {
        DownloaderWiFiSettings : false,
    }
    SaveSettings(value,key){
        this.setState({DownloaderWiFiSettings: value,});
        this.props.ReduxSaveSettings(value,key);
    }
    componentDidMount(){
        this.setState({DownloaderWiFiSettings:this.props.DownloaderWiFiSettings});
    }
    componentWillReceiveProps(nextProps){
        this.setState({DownloaderWiFiSettings:nextProps.DownloaderWiFiSettings,});
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.DownloaderWiFiSettings != this.state.DownloaderWiFiSettings
    }
    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.textHeader}>Downloader Settings</Text>
                <View style={{padding:5,flexDirection:"row", justifyContent: 'center',
                alignItems: 'center',}}>
                    <Text style={styles.textStyle}>Only download over Wi-Fi</Text>
                    <View style={{flex:0.5,alignItems: 'flex-end'}}>
                        <Switch 
                            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                            onValueChange={ (value) => this.SaveSettings(value,"DownloadOverWiFi")} 
                            value={ this.state.DownloaderWiFiSettings } 
                        />
                     </View>
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
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        color: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
    },
});