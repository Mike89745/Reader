
import React, { Component } from 'react';
import { StyleSheet, View, Text,Slider,Animated} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../../Icon/Icon';
export default class BottomNav extends Component {
    state = {
        value: 1,
        maxValue : 1,
        opacity : new Animated.Value(1)
    }
    ToggleNav = (shown) =>{
        if(shown){
            Animated.timing(this.state.opacity, { toValue: 0,duration:300,useNativeDriver:true }).start();
        }else{
            Animated.timing(this.state.opacity, { toValue: 1,duration:300,useNativeDriver:true }).start();
        }
        
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
            
            <Animated.View style={[styles.container,{opacity:this.state.opacity}]} ref={(ref) => { this.BottomNav = ref; }}>
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
            </Animated.View>
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
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        flexWrap: 'wrap',
        bottom:0,
        flexDirection: "row",
        elevation:99,
        zIndex:100,
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