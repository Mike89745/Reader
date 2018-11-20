import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../Icon/Icon';
export default class Description extends Component {
    state = {
        Lines:7,
    }
    ToggleLines(){
        if(this.state.Lines){
            this.setState({Lines : null})
        }else{
            this.setState({Lines : 7})
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.DescContainer}>
                    <Text style={styles.textHeader}>Description:</Text>
                    <View style={{flex:1,alignItems: 'flex-end'}}>
                        <ButtonIcon style={{justifyContent: 'flex-end'}} name="chevron-down" Color="#000" onPress={() => this.ToggleLines()} /> 
                    </View> 
                </View>
                <View style={styles.container}>
                    <Text numberOfLines={this.state.Lines} style={styles.textStyle}>{this.props.description}</Text>
                </View>
               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    DescContainer:{
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});