import React, { Component } from 'react';
import RF from "react-native-responsive-fontsize"
import { StyleSheet, View, Text,Button,Dimensions} from 'react-native';
import PopUpMenu from '../../../PopUpMenu/PopUpMenu';

export default class LibraryCategoryItem extends Component {
    state = {
    }
   
    removeCategory =( )=>{
        this.props.removeCategory(this.props.item);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>{this.props.category}</Text>
                <View style={{ justifyContent: 'center',
                alignItems: 'flex-end',flex:1,marginRight: 15}}>
                    <PopUpMenu Color="#000" name="dots-vertical" options={[{text:"Remove Category", onSelect: this.removeCategory}]}/>
                </View>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#ccc"
    },
    textStyle:{
        fontSize: RF(3.5),
        color: "black",
        flex: 1,
        padding: 15,
    },
    textHeader:{
        padding: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});