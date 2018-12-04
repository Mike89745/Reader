
import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class PopUpMenu extends Component {
    render() {
        return (
            <Menu>
                <MenuTrigger>
                  <View>
                    <Icon
                      iconStyle = {{margin: 8,borderWidth:0}}
                      name={this.props.name}
                      color={this.props.Color}
                      size={this.props.size ? this.props.size : 23}
                    />
                  </View> 
                </MenuTrigger>
                <MenuOptions>
                    {this.props.options ? this.props.options.map(option => <MenuOption onSelect={() => option.onSelect()} text={option.text} key={option.text}/>) : null}
                </MenuOptions>
            </Menu>
        )
    }
}
