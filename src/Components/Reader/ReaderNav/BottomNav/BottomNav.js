
import React, { Component } from 'react';
import { StyleSheet, View, Text,Slider,Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../../Icon/Icon';

export default class BottomNav extends Component {
    state = {
        value: 1,
        maxValue : 1,
    }

    setPage(value){
        this.props.setPage(value-1);
        this.setState({value:value});
    }
    setValue(value){
        this.setState({value:value});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ maxValue: nextProps.pages,value:nextProps.currentPage});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value != this.state.value;
    }
    render() {
        return (
            <View style={styles.container}>
                <ButtonIcon name="skip-previous" Color="#fff" onPress={() => this.props.prevChapter()}/>
                <View style={styles.SliderContainer}>
                    <View>
                        <Text style={styles.text}>{this.state.value}</Text>
                    </View>
                    <View style={{flex: 1, alignSelf:"stretch"}}>
                        <Slider
                            value={this.state.value}
                            onSlidingComplete={(value) => this.setPage(value)}
                            minimumValue={1}
                            onValueChange={value => {
                                this.setValue(value)
                            }}
                            maximumValue={this.state.maxValue}
                            step={1} 
                            thumbTintColor = {"#fff"}
                        />
                    </View>
                    <View>
                        <Text style={styles.text}>{this.state.maxValue}</Text>
                    </View>
                </View>
                <ButtonIcon style={{alignItems: "flex-end",}} name="skip-next" Color="#FFF" onPress={() => this.props.nextChapter()}/>  
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
        bottom: 0,
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: "row",
        
    },
    SliderContainer:{
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: 'center', 
        alignItems: 'center',
    },
    text:{
        color:"#FFF",
        fontSize: RF(2.5),
    },

  
});