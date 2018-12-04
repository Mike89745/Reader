import React, { Component } from 'react';
import { StyleSheet, View, Text,Dimensions,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../Icon/Icon';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
export default class DowloadItem extends Component {
    state={
        value : 0,
        maxValue: 0,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value,maxValue : nextProps.maxValue});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value != this.state.value || nextState.maxValue != this.state.maxValue;
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textHeader}>{this.props.title}</Text>
                <Text style={styles.textStyle}>{this.props.chapterName}</Text>
                <Text style={{textAlign:"right",paddingRight:15}}>{this.state.value ? this.state.value : 0}/{this.state.maxValue}</Text>
                <ProgressBarAnimated
                    width={Dimensions.get("screen").width - 30}
                    value={(this.state.value/this.state.maxValue) * 100}
                />
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