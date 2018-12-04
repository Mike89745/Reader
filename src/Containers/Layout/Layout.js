import React, { Component } from 'react';
import { StyleSheet, View,Text} from 'react-native';
import GridItems from "../../Components/GridItems/GridItems";
import Detail from "../../Components/Detail/Detail";
import {createStackNavigator,createDrawerNavigator} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import HeaderInput from "../../Components/HeaderInput/HeaderInput"
import HistoryScreen from "../../Components/HistoryScreen/HistoryScreen"
import LibraryScreen from "../../Components/LibraryScreen/LibraryScreen"
import ButtonIcon from "../../Components/Icon/Icon"
import Reader from "../../Components/Reader/Reader"
import DownloadsScreen from '../../Components/DownloadsScreen/DownloadsScreen';
export default class Layout extends Component{
    render() {
        return (
            <View style={styles.container}>
                <RootStack style={styles.container}/>
            </View>
        )
    }
}
const DownloadStack = createStackNavigator(
    {
        DownloadsScreen: {screen : DownloadsScreen},
    },
    {
        drawerLabel: 'Downloads',
        initialRouteName: 'DownloadsScreen',
        headerMode: 'float',
       
        navigationOptions: ({navigation}) => ({
            headerTitle: ( <Text style={{color:"white"}}>Downloads</Text> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);
const HistoryStack = createStackNavigator(
    {
        HistoryScreen: {screen : HistoryScreen},
    },
    {
        drawerLabel: 'Historie',
        initialRouteName: 'HistoryScreen',
        headerMode: 'float',
       
        navigationOptions: ({navigation}) => ({
            headerTitle: ( <HeaderInput/> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);
const ReaderStack = createStackNavigator(
    {
        ReaderScreen: {screen : Reader},
    },
    {
        drawerLabel: 'Reader',
        initialRouteName: 'ReaderScreen',
        headerMode: 'none',
    }
);
const LibraryStack = createStackNavigator(
    {
        LibraryScreen: {screen : LibraryScreen},
        Details: {screen : Detail},
        Reader : {screen : ReaderStack},
    },
    {
        drawerLabel: 'Knihovna',
        initialRouteName: 'LibraryScreen',
        headerMode: 'float',
        navigationOptions: ({navigation}) => ({
            headerTitle: ( <HeaderInput/> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);
const CatalogStack = createStackNavigator(
    {
        Catalog: {screen : GridItems},
        Details: {screen : Detail},
        Reader : {screen : ReaderStack},
    },
    {
        drawerLabel: 'Katalog',
        initialRouteName: 'Catalog',
        headerMode: 'float',
        
        navigationOptions: ({navigation}) => ({

            headerTitle: ( <HeaderInput/> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);


const Drawer = createDrawerNavigator(
    {
        Catalog: {screen : CatalogStack},
        History: {screen : HistoryStack},
        Library: {screen : LibraryStack},
        Download : {screen:DownloadStack},
    },
    {
        initialRouteName: 'Library',
        headerVisible: false,
        headerMode: 'none',
    }
    
);


const RootStack = createDrawerNavigator(
    {
        Drawer: { screen: Drawer },
        
    },
    {
        drawerPosition: 'right',
        initialRouteName: 'Drawer',
        headerVisible: false,
        headerMode: 'none',
    }
);
    
    



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
      }, 
});