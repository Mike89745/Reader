import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableHighlight} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from "../../../../Icon/Icon"
export default class Chapter extends Component {
    onPress = () => {
        //console.log("Touched")
    }
    render() {
        return ( 
            <TouchableHighlight underlayColor="#ccc" onPress={this.onPress}>
                <View style={styles.container} >
                    <View style={{flex:0.8}}>
                        <Text style={styles.textHeader}>Chapter {this.props.chapterName} - {this.props.chapterCount}</Text>
                        <Text style={styles.textDate}>{this.props.dateAdded}</Text>
                    </View>
                    <View style={{flex:0.2,alignItems:"flex-end",}}>
                        <ButtonIcon
                            onPress={() => this.onPress()}
                            name="more-vertical"
                            Color="#000"
                        />
                    </View>
                </View>
            </TouchableHighlight>
        ) 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#d6d7da',
        paddingLeft : 5,
        paddingRight : 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2),
        paddingBottom: 3,
        paddingTop: 3,
    },
    textDate:{
        fontSize: RF(1.5),
        paddingBottom: 3,
    },
   
});