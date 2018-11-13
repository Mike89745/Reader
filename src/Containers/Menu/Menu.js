
import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
  } from 'react-native-popup-menu';
const MenuHeight = Dimensions.get('window').height;
const MenuWidth = Math.floor(Dimensions.get('window').width/2.5);
export default class ToolBar extends Component {
    render() {
        return (
        <View style={styles.container}>
            <Text>WEED</Text>
            <Menu>
                <MenuTrigger text='Select action' customStyles={triggerStyles} />
                <MenuOptions customStyles={optionsStyles}>
                    <MenuOption onSelect={() => alert(`Save`)} text='Save' />
                    <MenuOption onSelect={() => alert(`Delete`)} >
                        <Text style={{color: 'red'}}>Delete</Text>
                    </MenuOption>
                <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
                </MenuOptions>
            </Menu>
        </View>
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
        height: MenuHeight,
        width : MenuWidth,
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
        height: MenuHeight,
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