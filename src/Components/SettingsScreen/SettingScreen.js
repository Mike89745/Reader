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
/**
 * Obrazovka se všemi nastaveními aplikace.
 */
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
    /**
     * Změní nastavení pomocí hodnoty key a setting. Potom nastavení uloží ho pomocí redux metody saveSettings.
     * @param {*} setting Nová hodnota nastavení
     * @param {*} key Jméno atributu nastavení
     */
    ReduxSaveSettings=(setting,key)=>{
        let settings = this.state.settings;
        settings[key] = setting
        this.props.saveSettings(settings);
    }
    /**
     * Načte nastvení z lokální databáze pomocí redux metody loadSettings.
     */
    componentWillMount(){
        this.props.loadSettings();
    }
    /**
     * Nastaví Redux state prop settings na state prop settings.
     */
    componentWillReceiveProps(nextProps){
        this.setState({settings:nextProps.settings})
    }
    render() {
        return (
            <ScrollView style={{flex:1}}>
            {this.state.settings ?( 
                <View style={{flex:1,padding:5}}>
                    <GeneralSettings ReduxSaveSettings={this.ReduxSaveSettings} LibraryLayoutSettings={this.state.settings.LibraryLayoutSettings}/>
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