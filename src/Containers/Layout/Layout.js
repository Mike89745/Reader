import React, { Component } from 'react';
import { StyleSheet, View,Text} from 'react-native';
import GridItems from "../../Components/GridItems/GridItems";
import Detail from "../../Components/Detail/Detail";
import {createStackNavigator,createDrawerNavigator} from 'react-navigation';
import HistoryScreen from "../../Components/HistoryScreen/HistoryScreen"
import LibraryScreen from "../../Components/LibraryScreen/LibraryScreen"
import ButtonIcon from "../../Components/Icon/Icon"
import Reader from "../../Components/Reader/Reader"
import DownloadsScreen from '../../Components/DownloadsScreen/DownloadsScreen';
import LibraryCategories from '../../Components/LibraryScreen/LibraryCategories/LibraryCategories';
import FilterDrawer from '../../Components/FilterDrawer/FilterDrawer';
import UserDrawer from '../../Components/UserDrawer/UserDrawer';
import Settings from '../../Components/SettingsScreen/SettingScreen';
import SyncProgressModal from '../../Components/Modals/SyncProgressModal';
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
        Reader: {screen : Reader},
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
                <SyncProgressModal></SyncProgressModal>
                <RootStack style={styles.container}/>
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