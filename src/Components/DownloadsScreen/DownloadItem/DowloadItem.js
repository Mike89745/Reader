import React, { Component } from 'react';
import { StyleSheet, View, Text,Dimensions,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import * as Progress from 'react-native-progress';
/**
 * Zobrazuje stahovanou kapitolu a postup stahování.
 */
export default class DowloadItem extends Component {
    state={
        value : 0,
        maxValue: 0,
        percentage : 0.01,
        width : Dimensions.get("screen").width - 65,
    }
    /**
     * Nastaví změněný postup na value a vypočítá nový procentuální postup ( state prop percentage).
     */
    componentWillReceiveProps(nextProps) {
        this.setState({ 
            value: nextProps.value,maxValue : nextProps.maxValue, 
            percentage : nextProps.value/nextProps.maxValue < 0.01 ? 0.01 : nextProps.value/nextProps.maxValue,
            maxValue : nextProps.maxValue
        });  
        console.log("hello:");
    }
    /**
     * Kontroluje jestli se něco změnil stav postupu.
     */
    shouldComponentUpdate(nextProps, nextState) {

        return nextState.value != this.state.value || nextState.maxValue != this.state.maxValue || nextProps.chapterName != this.props.chapterName || nextState.maxValue != this.state.maxValue || this.state.width != nextState.width;
    }
    _onLayout =()=>{
        this.setState({width:Dimensions.get("screen").width - 65});
    }
    render() {
        return (
            <View style={styles.container} onLayout={() => this._onLayout()}>
                <Text style={styles.textHeader}>{this.props.title ? this.props.title.replace((/[-]/g)," ") : null}</Text>
                <Text style={styles.textStyle}>{this.props.chapterName ? this.props.chapterName.replace((/[-]/g)," ") : null}</Text>
                <View style={{flexDirection : "row",flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}}>
                    <Progress.Bar
                        color= {"#3b424c"}
                        height={12}
                        width={this.state.width}
                        progress={this.state.percentage}
                        useNativeDriver={true}
                    />
                    <Text style={{textAlign:"right",paddingRight:15, paddingLeft:15}}>{this.state.value ? this.state.value : 0}/{this.state.maxValue}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 15,
        borderBottomWidth: 2,
        paddingTop: 8,
        borderColor: '#d6d7da',
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
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});