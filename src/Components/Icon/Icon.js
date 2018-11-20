import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class ButtonIcon extends Component {
    
    render() {
        return (
                <Icon.Button
                    name={this.props.name}
                    color = {this.props.Color ? this.props.Color : "transparent" }
                    backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : "rgba(120,120,120,0)" } onPress={this.props.onPress}
                    borderRadius={this.props.borderRadius ? this.props.borderRadius : 50 }
                    iconStyle = {{margin: 8,borderWidth:0}}
                    size = {this.props.size ? this.props.size : 20}
                    >
                    {this.props.text}
                </Icon.Button>
        )
    }
}

const styles = StyleSheet.create({

});