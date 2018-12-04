
import React, { Component } from 'react';
import { StyleSheet, View, Button,Text} from 'react-native';
import ButtonIcon from '../../../Icon/Icon';
export default class TopNav extends Component {
   
    render() {
        return (
            <View style={styles.container}>
                <ButtonIcon name="arrow-left" Color="#fff" onPress={() => this.props.nav.goBack(null)} />
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={1} style={{color:"#fff",flex:1}}>{this.props.title ? this.props.title : "title"}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={1} style={{color:"#fff",flex:1}}>{this.props.chapter ? this.props.chapter : "Chapter"}</Text>    
                    </View>
                </View>
                <ButtonIcon style={{color:"#fff",alignItems: "flex-end", justifyContent: 'center',}} name="settings" Color="#FFF" onPress={() => this.props.showSettings()}/>  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        width: '100%', 
        backgroundColor: "#3b424c",
        height:50,
        position: 'absolute',
        top: 24,
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        alignItems: "flex-start",
    },
   
   
});