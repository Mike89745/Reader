
import React, { Component } from 'react';
import { StyleSheet, View, Text,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerActions } from 'react-navigation';
import ButtonIcon from "../Icon/Icon"
import LibraryTab from './LibraryTab/LibraryTab';
import {createMaterialTopTabNavigator } from "react-navigation"
import PouchDB from 'pouchdb-react-native';
import GridItems from '../GridItems/GridItems';
const db = new PouchDB('categories');
export default class LibraryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
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
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        };
      };
    state = {
        categories:["Default"],
    } 
    tabs(categories) {
        return categories.reduce((routes, category) => {
            routes[category] = this.tab(category);
            return routes;
        }, {});
    }
    
    tab(category) {
        const screen = this.getTabForCategory(category);
        return {
            screen: screen,
            navigationOptions: {
                title: category,
            }
        }        
    }
    
    getTabForCategory (category){
        return () => (<LibraryTab category={category} nav={this.props.navigation} />);
    }
    componentWillMount(){
        db.allDocs().then((Response) => {
            let temp = [];
            for(let i of Response.rows){
                i && temp.push(i.doc.category);
            }
            temp.length > 0 ? null : temp.unshift("Default");
            this.setState({categories:temp})
        }).catch(error => console.log(error));
    }
    render() {
        const Tabs = createMaterialTopTabNavigator(this.tabs(this.state.categories), {
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
        });
        
        return (
            <View style={styles.container}>
                {this.state.categories ? <Tabs/> : <GridItems isLibrary={true} navigation={this.props.navigation}/>}
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