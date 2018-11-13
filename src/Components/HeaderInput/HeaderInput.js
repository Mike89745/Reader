import React, { Component } from 'react';
import { StyleSheet, View, TextInput,ScrollView} from 'react-native';
import RF from "react-native-responsive-fontsize"
export default class Input extends Component {
    state = { 
        text: '' 
    };
    render() {
        return (
           <TextInput style={styles.Input} onChangeText={(text) => this.setState({text})}
           value={this.state.text} placeholder="Search..." placeholderTextColor="#FFF"/>
        )
    }
}

const styles = StyleSheet.create({
    Input :{
        color : "#FFF",
        
    }
});