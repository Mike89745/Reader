import React, { Component } from 'react';
import { StyleSheet, View, Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ChapterList from "./ChapterList/ChapterList"
import ReviewList from "./ReviewList/ReviewList"
import {createMaterialTopTabNavigator } from "react-navigation"
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
    onLayout(e) {
        this.setState({deviceHeight : Dimensions.get('window').height - 80,});
    }

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