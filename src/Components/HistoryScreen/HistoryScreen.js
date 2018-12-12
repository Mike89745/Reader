
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text,Button,Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerActions } from 'react-navigation';
import ButtonIcon from '../Icon/Icon';
import HistoryItem from './HistoryItem/HistoryItem';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
export default class HistoryScreen extends Component {
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
        historyItems : []
    } 
    loadHistory = () =>{
        
    }  
    componentDidMount(){
        this.loadHistory();
    }
    render() {
        return (
            <ScrollView style={styles.container}>
               <HistoryItem/>
               <HistoryItem/>
               <HistoryItem/>
               <HistoryItem/>
               <HistoryItem/>
               <HistoryItem/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});