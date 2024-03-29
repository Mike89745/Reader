
import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from "../Icon/Icon"
import LibraryTab from './LibraryTab/LibraryTab';
import {createMaterialTopTabNavigator } from "react-navigation"
import PouchDB from 'pouchdb-adapters-rn';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import ToggleFilterDrawerButton from '../HeaderButtons/ToggleFilterDrawerButton/ToggleFilterDrawerButton';
import GridItemsHeaderRight from '../GridItems/GridItemsHeaderRight/GridItemsHeaderRight';
import { connect } from 'react-redux';
import {
    GetBooksFromLibrary,
} from '../../reducers/API/APIActions';
const db = new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
/**
 * Obrazovka knihovny s kategoriemi.
 */
class LibraryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
                
                shadowColor: "#fff",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity:0,
                shadowRadius: 0,

                elevation: 0,
              },
            headerMode: 'float',
            headerTitle: ( <Text style={{color:"white"}}>Library</Text> ),
            headerLeft: (
                <ToggleMainDrawerButton/>
            ),
            headerRight :(
                <View style={{flexDirection : "row",flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginRight:15}}>
                    <ButtonIcon Color="#ffffff" name="tag-multiple" onPress={() => navigation.navigate("LibraryCategories")}/>
                    <ToggleFilterDrawerButton/>
                    <GridItemsHeaderRight></GridItemsHeaderRight>
                </View>
            ),
        };
      };
    state = {
        categories:null,
        syncing : false,
    }
    /**
     * Listener sloužící k obnovení komponentu při akci “WillFocus”. Akce se při navigaci na Library.
     */
    reRender = this.props.navigation.addListener('willFocus', () => {
        this.RefreshComponent();
    });
    /**
     * Kontroluje jestli se dokončila synchronizace knihovny, pokud ano zavolá metodu RefreshComponent.
     */
    componentWillReceiveProps(NextProps){
        if(!NextProps.syncing && this.state.syncing){
            this.RefreshComponent();
        } 
        this.setState({syncing : NextProps.syncing})
    }
    /**
     * Načte znovu kategorie z lokální databáze.
     */
    RefreshComponent =() =>{
        this.props.GetBooksFromLibrary()
        this.setState({categories:null});
        db.allDocs().then((Response) => {
            let temp = [];
            for(let i of Response.rows){
                i && temp.push(i.id);
            }
            temp.unshift("Default");
            this.setState({categories:temp})
        }).catch(error => console.log(error));
    }     
    /**
     * Vytváří kategorie a jejich cesty.
     */
    CreateTabs(categories) {
        return categories.reduce((routes, category) => {
            routes[category] = this.CreateTab(category);
            return routes;
        }, {});
    }
    /**
     * Vytváří obrazovky kategorie.
     * @param {*} category Komponent LibraryTab
     */
    CreateTab(category) {
        const screen = this.getTabForCategory(category);
        return {
            screen: screen,
            lazy: true,
            navigationOptions: {
                title: category,
            }
        }        
    }
    /**
     * Vytváří komponent kategorie LibraryTab.
     * @param {*} category Jméno kategorie
     */
    getTabForCategory (category){
        return () => (<LibraryTab category={category} nav={this.props.navigation} />);
    }
    /**
     * Nastaví navigační parametr refresh na metodu RefreshComponent.
     */
    componentWillMount(){
        this.props.navigation.setParams({refresh : () => this.RefreshComponent()});
    }
    /**
     * Odebere Listener reRender.
     */
    componentWillUnmount(){
        this.reRender;
    }
    render() {
        const Tabs = this.state.categories ? createMaterialTopTabNavigator(this.CreateTabs(this.state.categories), {
            tabBarOptions: {
                activeBackgroundColor: "#FFF",  
                activeTintColor: '#FFF',
                inactiveBackgroundColor: "#FFF",
                inactiveTintColor: "#afafaf",
                scrollEnabled: true,
                style: {
                  backgroundColor: '#3b424c',
                  color:"#FFF"
                },
                indicatorStyle:{
                    
                    backgroundColor: "#FFF"
                },
            },
        }) : null;
        
        return (
            <View style={styles.container}>
                {this.state.categories ? <Tabs/> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});
const mapStateToProps = state => {
    return {
        syncing : state.UserReducer.syncing,
    };
};
const mapDispatchToProps = {
    GetBooksFromLibrary,
};
export default connect(mapStateToProps, mapDispatchToProps)(LibraryScreen);