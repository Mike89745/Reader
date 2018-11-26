
import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import ButtonIcon from '../../../../../Icon/Icon';
export default class ChapterPopUp extends Component {
    render() {
        return (
            <Menu>
                <MenuTrigger>
                  <ButtonIcon
                    name="dots-vertical"
                    Color="#000"
                    size={15}
                  />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => alert(`Download`)} text='Download' />
                    <MenuOption onSelect={() => alert(`Marked as read`)} text='Mark as read'/>
                    <MenuOption onSelect={() => alert(`Delete`)} >
                        <Text>Delete</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        )
    }
}
const triggerStyles = {
    triggerText: {
      color: 'white',
    },
    triggerOuterWrapper: {
      padding: 5,
    },
    triggerWrapper: {
      backgroundColor: 'blue',
    },
    triggerTouchable: {
      underlayColor: 'darkblue',
      activeOpacity: 70,
      
    },
  };
  const optionStyles = {
    optionTouchable: {
      underlayColor: 'red',
      activeOpacity: 40,
    },
    optionWrapper: {
      backgroundColor: 'pink',
      margin: 5,
    },
    optionText: {
      color: 'black',
    },
  };
const styles = StyleSheet.create({
    Menu: {
      backgroundColor: "black",
    }, 
    container: {
        paddingTop: 10,
        height: 50,
        backgroundColor : "yellow",
    }, 
});
const optionsStyles = {
    optionsContainer: {
        padding: 10,
        backgroundColor: "black",
    },
    optionsWrapper: {
      backgroundColor: 'purple',
    },
    optionWrapper: {
      backgroundColor: 'yellow',
      margin: 5,
    },
    optionTouchable: {
      underlayColor: 'gold',
      activeOpacity: 70,
    },
    optionText: {
      color: 'brown',
    },
  };