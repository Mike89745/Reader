import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import RF from "react-native-responsive-fontsize"

export default class TagList extends Component {
    
    render() {
        let Tags = null
        if(this.props.tags){
             Tags = Object.keys( this.props.tags ).map( key => { 
                return <Text style={styles.tag}>{this.props.tags[key]}</Text>;
            });
        }
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.textHeader}>Tags</Text>
                </View>
                <View style={styles.tagContainer}>
                    {Tags}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
        paddingBottom: 5,
    },
    tagContainer:{
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        alignItems: "flex-start",
    },
    tag:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 5,
        marginBottom: 10,
        fontSize: RF(2.5),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#0099CC'
    }
});