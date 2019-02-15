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
import ReviewScreen from '../../Components/Detail/ReviewScreen/ReviewScreen'
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
        Details: {screen : Detail},
        ReviewScreen:{screen : ReviewScreen},
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
        Details: {
            screen : Detail,
            navigationOptions: ({navigation}) => ({drawerLockMode:"locked-closed"})
        },
        ReviewScreen:{screen : ReviewScreen},
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
        ReviewScreen:{screen : ReviewScreen},
        Reader: {screen : Reader},
    },
    {
        drawerLabel: 'Katalog',
        initialRouteName: 'Catalog',
        headerMode: 'float',
        navigationOptions: ({navigation}) => ({
            drawerLockMode:"locked-closed",
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
        Downloads : {screen:DownloadStack},
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
Drawer.navigationOptions = ({ navigation }) => {
    let name = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
    let drawerLockMode = 'locked-closed'
    name = name.routes[name.index]  
    if (name.routeName === 'LibraryScreen' || name.routeName === 'Catalog') {
        drawerLockMode = 'unlocked'
    }
    return {
        drawerLockMode,
    };
}


const RootStack = createDrawerNavigator( 
    // vytváří navigaci s otevíracím menu, createStackNavigator vytváří navigaci bez menu
    {
        Drawer: { screen: Drawer }, // "Jméno stránky" : { screen : "Jméno komponentu"}
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
        drawerLockMode:"locked-closed"
    }
);
RootStack.navigationOptions = ({ navigation }) => {
    let name = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
    let drawerLockMode = 'locked-closed'
    if (name.routeName === 'LibraryScreen' || name.routeName === 'Catalog') {
        drawerLockMode = 'unlocked'
    }
    return {
        drawerLockMode,
    };
}

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