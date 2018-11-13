import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"

export default class Info extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>Name : {this.props.info.Name}</Text>
                <Text style={styles.textStyle}>Author : {this.props.info.Author}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.Rating}</Text>
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