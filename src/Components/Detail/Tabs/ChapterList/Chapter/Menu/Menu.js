
import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { DownloadSingle } from "../../../../../../reducers/downloader/downloaderActions";
/**
 *  PopUpMenu pro kapitolu
 */
class ChapterPopUp extends Component {
    render() {
        return (
            <Menu>
                <MenuTrigger>
                  <View>
                    <Icon
                      iconStyle = {{margin: 8,borderWidth:0}}
                      name="dots-vertical"
                      Color="#000"
                      size={23}
                    />
                  </View> 
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => this.props.DownloadSingle(this.props.chapter)} ><Text style={{padding: 5}}>Download</Text></MenuOption>
                    <MenuOption onSelect={() => this.props.markAsRead()} ><Text style={{padding: 5}}>Toggle mark as read</Text></MenuOption>
                    <MenuOption onSelect={() => this.props.delete()} ><Text style={{padding: 5}}>Delete</Text></MenuOption>
                    
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
  const mapStateToProps = state => {
    return {
      
    };
};
const mapDispatchToProps = {
  DownloadSingle
};
export default connect(mapStateToProps, mapDispatchToProps)(ChapterPopUp);