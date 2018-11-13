import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
export default class ButtonIcon extends Component {
    
    render() {
        return (
            <View style={{justiftyContent:"center", alignItems:"center"}}>
                <Icon.Button
                    name={this.props.name}
                    color = {this.props.Color ? this.props.Color : "transparent" }
                    backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : "rgba(120,120,120,0)" } onPress={this.props.onPress}
                    borderRadius={this.props.borderRadius ? this.props.borderRadius : 15 }
                    iconStyle = {{marginLeft: 10}}
                    >
                    {this.props.text}
                </Icon.Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({

});