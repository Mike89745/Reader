import React, { Component } from 'react';
import { StyleSheet, View,TextInput,Text} from 'react-native';
import GridItems from "../../Components/GridItems/GridItems";
import Detail from "../../Components/Detail/Detail";
import {createStackNavigator,createDrawerNavigator} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import HeaderInput from "../../Components/HeaderInput/HeaderInput"
import HistoryScreen from "../../Components/HistoryScreen/HistoryScreen"
import LibraryScreen from "../../Components/LibraryScreen/LibraryScreen"
import ButtonIcon from "../../Components/Icon/Icon"
import Reader from "../../Components/Reader/Reader"
export default class Layout extends Component{
    render() {
        return (
            <View style={styles.container}>
                <RootStack style={styles.container}/>
            </View>
        )
    }
}
const LibraryStack = createStackNavigator(
    {
        LibraryScreen: {screen : LibraryScreen},
        Details: {screen : Detail},
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
                    name="magic"
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
                    name="magic"
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
const CatalogStack = createStackNavigator(
    {
        Catalog: {screen : GridItems},
        Details: {screen : Detail},
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
                    name="magic"
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
        Reader : {screen : ReaderStack},
    },
    {
        initialRouteName: 'Catalog',
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