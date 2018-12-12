import React, { Component } from 'react';
import { StyleSheet, View,Text,Button} from 'react-native';
import GridItems from "../../Components/GridItems/GridItems";
import Detail from "../../Components/Detail/Detail";
import {createStackNavigator,createDrawerNavigator} from 'react-navigation';
import { DrawerActions } from 'react-navigation';
import HistoryScreen from "../../Components/HistoryScreen/HistoryScreen"
import LibraryScreen from "../../Components/LibraryScreen/LibraryScreen"
import ButtonIcon from "../../Components/Icon/Icon"
import Reader from "../../Components/Reader/Reader"
import DownloadsScreen from '../../Components/DownloadsScreen/DownloadsScreen';
import LibraryCategories from '../../Components/LibraryScreen/LibraryCategories/LibraryCategories';
import FilterDrawer from '../../Components/FilterDrawer/FilterDrawer';
import UserDrawer from '../../Components/UserDrawer/UserDrawer';
import GeneralSettings from '../../Components/SettingsScreen/GeneralSettings/GeneralSettings';
import Settings from '../../Components/SettingsScreen/SettingScreen';
import ReaderSettings from '../../Components/SettingsScreen/ReaderSetting/ReaderSetting';
import AdvancedSettings from '../../Components/SettingsScreen/AdvancedSettings/AdvancedSettings';
import DownloaderSettings from '../../Components/SettingsScreen/DownloadeSettings/DownloaderSettings';
import { connect } from 'react-redux'
import {
    setMainDrawer,
    setFilterDrawer,
    ToggleFilterDrawer,
    ToggleMainDrawer
  } from '../../reducers/DrawerNavigation/DrawerNavigationActions'
const SettingsStack = createStackNavigator(
    {
        Settings:{screen : Settings},
        GeneralSettings: {screen : GeneralSettings},
        ReaderSettings: {screen : ReaderSettings},
        AdvancedSettings: {screen : AdvancedSettings},
        DownloaderSettings: {screen : DownloaderSettings},
    },
    {
        drawerLabel: 'Settings',
        initialRouteName: 'Settings',
        headerMode: 'float',
       
        navigationOptions: ({navigation}) => ({
            headerTitle: ( <Text style={{color:"white"}}>Settings</Text> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.navigate("MainDrawerOpen")}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);
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
                    onPress={() => navigation.navigate("MainDrawerOpen")}
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
            headerTitle: (<Text style={{color:"white"}}>History</Text>  ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.navigate("MainDrawerOpen")}
                    name="menu"
                    Color="#fff"
                />
            )
        })
    }
);

const LibraryStack = createStackNavigator(
    {
        LibraryScreen: {screen : LibraryScreen},
        Details: {screen : Detail},
        Reader: {screen : Reader},
        LibraryCategories : {screen : LibraryCategories}
    },
    {
        drawerLabel: 'Library',
        initialRouteName: 'LibraryScreen',
        navigationOptions: ({navigation}) => ({

            headerTitle: ( <Text style={{color:"white"}}>Library</Text> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.navigate("MainDrawerOpen")}
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
        Reader: {screen : Reader},
    },
    {
        drawerLabel: 'Katalog',
        initialRouteName: 'Catalog',
        headerMode: 'float',
        
        navigationOptions: ({navigation}) => ({

            headerTitle: ( <Text style={{color:"white"}}>Catalog</Text> ),
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.navigate("MainDrawerOpen")}
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
        Settings : {screen : SettingsStack},
    },
    {
        contentComponent: ({ navigation }) => (
           <UserDrawer navigation={navigation}/>
        ),
        initialRouteName: 'Library',
        headerVisible: false,
        headerMode: 'none',
        drawerOpenRoute: 'MainDrawerOpen',
        drawerCloseRoute: 'MainDrawerClose',
    }
);


const RootStack = createDrawerNavigator(
    {
        Drawer: { screen: Drawer },
    },
    {
        contentComponent: ({ navigation }) => (
            <FilterDrawer navigation={navigation} />
        ),
        drawerPosition: 'right',
        initialRouteName: 'Drawer',
        headerVisible: false,
        headerMode: 'none',
        drawerOpenRoute: 'FilterDrawerOpen',
        drawerCloseRoute: 'FilterDrawerClose',
    }
);


class Layout extends Component{
    render() {
        return (
            <View style={styles.container}>
                <RootStack style={styles.container} drawerLockMode={'locked-closed'}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
      }, 
});
const mapStateToProps = state => {
    return {
        FilterDrawer : state.DrawerNav.FilterDrawer,
        MainDrawer : state.DrawerNav.MainDrawer
    };
};
const mapDispatchToProps = {
    setFilterDrawer,
    setMainDrawer,
    ToggleFilterDrawer,
    ToggleMainDrawer,
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);