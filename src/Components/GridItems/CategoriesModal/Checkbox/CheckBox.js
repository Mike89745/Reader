import React, { Component } from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/**
 * Zobrazuje yaškrtávající políčko.
 */
export default class CheckBoxe extends Component {
    state = {
        isChecked: false,
    }
    /**
     * Mění state prop isChecked na true nebo false.
     */
    checkboxClick=()=>{
        let checked = !this.state.isChecked;
        this.setState({isChecked : checked});
    }
    /**
     * Vrací prop text.
     */
    getID = () =>{
        return this.props.text;
    }
    /**
     * Vrací state prop isChecked.
     */
    isChecked =()=>{
        return this.state.isChecked;
    }
    /**
     * Nastavuje state prop isChecked pokud se změnila prop isChecked.
     */
    componentWillReceiveProps(nextProps){
        this.setState({isChecked:nextProps.isChecked});
    }
    /**
     * Nastavuje základní hodnotu state prop isChecked.
     */
    componentDidMount(){
        this.setState({isChecked: this.props.isChecked})
    }

     
    render() {
        return (
            <View style={{flex: 1,padding: 5}}>
                <CheckBox
                    style={{flex: 1}}
                    onClick={this.checkboxClick}
                    isChecked={this.state.isChecked ? true : false}
                    leftText={this.props.text ? this.props.text : "error"}
                    checkedImage={
                        <Icon  name={"checkbox-marked"}
                        color = {"green"}
                        backgroundColor={"rgba(120,120,120,0)" }
                        borderRadius={0}
                        iconStyle = {{margin: 8,borderWidth:0}}
                        size = {20}/> }
                    unCheckedImage={<Icon  name={"checkbox-blank-outline"}
                        color = {"black" }
                        backgroundColor={"rgba(120,120,120,0)" }
                        borderRadius={0}
                        iconStyle = {{margin: 8,borderWidth:0}}
                        size = {20}/>  }
                />
            </View>
        )

    }
}