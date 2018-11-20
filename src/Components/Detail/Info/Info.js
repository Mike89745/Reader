import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"

export default class Info extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textStyle}>title : {this.props.info._id}</Text>
                <Text style={styles.textStyle}>author : {this.props.info.author}</Text>
                <Text style={styles.textStyle}>artist : {this.props.info.artist}</Text>
                <Text style={styles.textStyle}>Rating : {this.props.info.rating}</Text>
                <Text style={styles.textStyle}>status : {this.props.info.status}</Text>
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