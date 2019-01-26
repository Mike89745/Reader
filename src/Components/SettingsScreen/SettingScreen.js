import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RF from "react-native-responsive-fontsize";
import ButtonIcon from '../Icon/Icon';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import GeneralSettings from './GeneralSettings/GeneralSettings';
import DownloaderSettings from './DownloadeSettings/DownloaderSettings';
import ReaderSettings from './ReaderSetting/ReaderSetting';
import { connect } from 'react-redux'
import {
    loadSettings,
    saveSettings
  } from '../../reducers/Settings/SettingsActions'
import AdvancedSettings from './AdvancedSettings/AdvancedSettings';
class Settings extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ToggleMainDrawerButton/>
            ),
            drawerLockMode: 'locked-closed',
        };
    };
    state = {
        settings : null,
    }
    ReduxSaveSettings=(setting,key)=>{
        let settings = this.state.settings;
        settings[key] = setting
        this.props.saveSettings(settings);
    }
    componentWillMount(){
        this.props.loadSettings();
    }
    componentWillReceiveProps(nextProps){
        this.setState({settings:nextProps.settings})
    }
    render() {
        return (
            <ScrollView style={{flex:1}}>
            {this.state.settings ?( 
                <View style={{flex:1,padding:5}}>
                    <GeneralSettings ReduxSaveSettings={this.ReduxSaveSettings} LibraryLayoutSettings={this.state.settings.LibraryLayoutSettings} StartScreenSettings={this.state.settings.StartScreen}/>
                    <ReaderSettings ReduxSaveSettings={this.ReduxSaveSettings} ReaderSettings={this.state.settings.ReaderLayout}/>
                    <DownloaderSettings ReduxSaveSettings={this.ReduxSaveSettings} DownloaderWiFiSettings={this.state.settings.DownloadOverWiFi}/>
                    <AdvancedSettings></AdvancedSettings>
                </View>) : null}
               
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"row",
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
        fontSize: RF(3.5),
        color: "black"
    }
});
const mapStateToProps = state => {
    return {
        settings: state.Settings.Settings,
    };
};
const mapDispatchToProps = {
    saveSettings,
    loadSettings
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);