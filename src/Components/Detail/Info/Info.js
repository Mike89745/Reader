import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"
/** 
 * Zobrazuje informace o knize : titul,autora,ilustrátora,hodnocení a status.
 */
export default class Info extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>Title : {this.props.info._id}</Text>
                <Text style={styles.textStyle}>Author : {this.props.info.author}</Text>
                <Text style={styles.textStyle}>Artist : {this.props.info.artist}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.rating}</Text>
                <Text style={styles.textStyle}>Status : {this.props.info.status}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop : 10,
    },
    textStyle:{
        fontSize: RF(2.5),
    }
});