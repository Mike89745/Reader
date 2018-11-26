import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableHighlight} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from "../../../../Icon/Icon"
import ChapterPopUp from './Menu/Menu';
import { MenuProvider } from 'react-native-popup-menu';
export default class Chapter extends Component {

    render() {
        return ( 
            <TouchableHighlight underlayColor="#ccc" onPress={() => this.props.nav.navigate('Reader',{
                title: this.props.bookID,
                chapter: this.props.chapterCount,
                })}
                onLongPress={() => console.log("Long Press")}>
                <View style={styles.container} >
                    <View style={{flex:0.8}}>
                        <Text style={styles.textHeader}>Chapter {this.props.chapterCount} - {this.props.chapterName}</Text>
                        <Text style={styles.textDate}>{this.props.dateAdded}</Text>
                    </View>
                    <View style={{flex:0.2,alignItems:"flex-end",}}>
                        <ChapterPopUp/>
                    </View>
                </View>
            </TouchableHighlight>
        ) 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#d6d7da',
        paddingLeft : 5,
        paddingRight : 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2),
        paddingBottom: 3,
        paddingTop: 3,
    },
    textDate:{
        fontSize: RF(1.5),
        paddingBottom: 3,
    },
   
});