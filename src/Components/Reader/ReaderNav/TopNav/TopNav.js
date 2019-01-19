
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,Text} from 'react-native';
import ButtonIcon from '../../../Icon/Icon';
export default class TopNav extends Component {
    state={
        height:Dimensions.get("screen").height - 50
    }
    onLayout(){
        this.setState({height:Dimensions.get("screen").height - 50});
    }
    render() {
        return (
            <View style={[styles.container, {bottom: this.state.height}]} onLayout={() => this.onLayout()}>
                <ButtonIcon name="arrow-left" Color="#fff" onPress={() => this.props.nav.goBack(null)} />
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={1} style={{color:"#fff",flex:1}}>{this.props.title ? this.props.title : "title"}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text numberOfLines={1} style={{color:"#fff",flex:1}}>{this.props.chapter ? this.props.chapter : "Chapter"}</Text>    
                    </View>
                </View>
                <View style={{flexDirection : "row",alignItems: 'flex-end',justifyContent:"center"}}> 
                    <ButtonIcon name="settings" Color="#FFF" onPress={() => this.props.showSettings()}/>
                </View>  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        backgroundColor: "#3b424c",
        height:50,
        position: 'absolute',
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: "row",
    },
});