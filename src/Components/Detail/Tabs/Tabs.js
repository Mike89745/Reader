import React, { Component } from 'react';
import { StyleSheet, View, Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ChapterList from "./ChapterList/ChapterList"
import ReviewList from "./ReviewList/ReviewList"
import {createMaterialTopTabNavigator } from "react-navigation"
/*Slouží k navigaci mezi kartami ChapterList a ReviewList.*/
export default class Tabs extends Component {
    state = {
        deviceHeight: null,
       
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: "#fff"
            },
        };
      };
    /*Zavolá se při otočení displeje a přizpůsobí DeviceHeight k změněné výšce displeje.*/
    onLayout(e) {
        this.setState({deviceHeight : Dimensions.get('window').height - 80,});
    }
    /*Nastaví základní state deviceHeight */
    componentWillMount() {
        this.setState({deviceHeight : Dimensions.get('window').height - 80,});
    }
   
    render() {
        return (
            <View style={[styles.container,{height: this.state.deviceHeight}]} onLayout={this.onLayout.bind(this)}>
                <TabsNav screenProps={{bookID: this.props.bookID,nav:this.props.nav}}/>
            </View>
        )
    }
}
/*Vytvoření navigace pro karty a styl Headeru.*/
const TabsNav = createMaterialTopTabNavigator (
    {
        Chapter: { screen: props => <ChapterList {...props}/>},
        Review: { screen: props => <ReviewList {...props}/>},
    },
    { 
        tabBarOptions: {
            activeBackgroundColor: "#FFF",  
            activeTintColor: '#FFF',
            inactiveBackgroundColor: "#FFF",
            inactiveTintColor: "#afafaf",
           
            style: {
              backgroundColor: '#3b424c',
              color:"#FFF"
            },
            indicatorStyle:{
                backgroundColor: "#FFF"
            },
        },
        initialRouteName: 'Chapter',
    }
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

});