import React, { Component } from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/**
 * Checkbox se třemi stavy - Checked, Unchecked, isIndeterminate
 */
export default class TriStateCheckBox extends Component {
    state = {
        isChecked: false,
        isIndeterminate: false,
    }
    /**
     * vrací prop text.
     */
    getID = () =>{
        return this.props.text;
    }
    /**
     * vrací jestli je zaškrtnutí.
     */
    isChecked =()=>{
        if(this.state.isIndeterminate) return false;
        return this.state.isChecked;
    }
    /**
     * vrací jestli není zaškrtnutí.
     */
    isIndeterminate = () => {
        return this.state.isIndeterminate;
    }
    /**
     * Volána při stisknutí CheckBoxu.
     * Mění state isChecked a isIndeterminate.
     */
    checkboxClick=()=>{
        let isChecked = this.state.isChecked;
        let isIndeterminate = this.state.isIndeterminate;
        if(isChecked === false && isIndeterminate == false) {
            isChecked = true;
        } else if(isChecked === true && isIndeterminate == false) {
            isIndeterminate = true;
        } else if(isChecked === true && isIndeterminate == true) {
            isChecked = false;
            isIndeterminate = false;
        }
        this.setState({isChecked:isChecked,isIndeterminate:isIndeterminate});
    }
    render() {
        return (
            <View style={{flex: 1,padding: 5}}>
               <CheckBox
                    onClick={()=>this.checkboxClick()}
                    isChecked={this.state.checked}
                    isIndeterminate={this.state.indeterminate}
                    leftText={this.props.text}
                    checkedImage={
                        this.state.isIndeterminate ? 
                            <Icon  name={"close-box"}
                                color = {"red" }
                                backgroundColor={"rgba(120,120,120,0)" }
                                borderRadius={0}
                                iconStyle = {{margin: 8,borderWidth:0}}
                                size = {20}/> 
                                : this.state.isChecked ?  
                                    <Icon  name={"checkbox-blank-outline"}
                                    color = {"black"}
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0}}
                                    size = {20}/> 
                                    : <Icon  name={"checkbox-blank-outline"}
                                    color = {"black"}
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0}}
                                    size = {20}/>}
                    unCheckedImage={this.state.isIndeterminate ? 
                    <Icon  name={"close-box"}
                        color = {"red" }
                        backgroundColor={"rgba(120,120,120,0)" }
                        borderRadius={0}
                        iconStyle = {{margin: 8,borderWidth:0}}
                        size = {20}/>  : this.state.isChecked ?  
                        <Icon  name={"checkbox-marked"}
                        color = {"green"}
                        backgroundColor={"rgba(120,120,120,0)" }
                        borderRadius={0}
                        iconStyle = {{margin: 8,borderWidth:0}}
                        size = {20}/> 
                        :  <Icon  name={"checkbox-blank-outline"}
                        color = {"black"}
                        backgroundColor={"rgba(120,120,120,0)" }
                        borderRadius={0}
                        iconStyle = {{margin: 8,borderWidth:0}}
                        size = {20}/> }
                />
            </View>
        )

    }
}