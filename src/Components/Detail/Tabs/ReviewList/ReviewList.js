import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Review from "./Review/Review"
export default class ReviewList extends Component {
    
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>

               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
                
               <Review userName="Mike" Rating="9"/>
               <Review userName="Mike" Rating="9"/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        flex: 1,
    },
   
});