import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
export default class ChapterList extends Component {
    
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
                <Chapter chapterName="Deez nuts" chapterCount="1" dateAdded="06.11.2018"/>
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