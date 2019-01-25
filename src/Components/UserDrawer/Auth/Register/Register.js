import React, { Component } from 'react';
import { StyleSheet,View,Text,TouchableOpacity,Animated,TextInput} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { connect } from 'react-redux'
import {SignUp} from "../../../../reducers/User/UserActions"
class Register extends Component {
    state = {
        email: null,
        password: null,
        nick : null,
        passwordMatch : false,
        emailMatch : false
    }
    Register=()=>{
        if(this.state.emailMatch && this.state.passwordMatch && this.state.nick) this.props.SignIn(this.state.nick,this.state.password,this.state.email);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.email && nextState.email){
            if(this.state.email != nextState.email){
                nextState.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) 
                ?
                this.setState({emailMatch: true}) : this.setState({emailMatch : false});
            }
        }else{
            this.state.emailMatch ? this.setState({emailMatch : false}) : null;
        }
        if(this.state.email && nextState.email){
            if(this.state.password != nextState.password){
                nextState.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) ?
                this.setState({passwordMatch: true}) : this.setState({passwordMatch : false});
            }
        }
        else{
            this.state.passwordMatch ? this.setState({passwordMatch : false}) : null;
        }
        return true;
    }
    render() {
        return (
            <Animated.View>
                <View style={{flex:1}}>
                    <TextInput
                        style={[styles.SignInInput,{borderBottomColor: this.state.emailMatch ? '#FFF' : "red"}]}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        placeholder="Email"
                        placeholderTextColor={"#fff"}
                    />
                </View>
                <View style={{flex:1}}>
                    <TextInput
                        style={[styles.SignInInput]}
                        onChangeText={(nick) => this.setState({nick})}
                        value={this.state.nick}
                        placeholder="Nick"
                        placeholderTextColor={"#fff"}
                    />
                </View>
                <View style={{flex:1}}>
                    <TextInput
                        style={[styles.SignInInput,{borderBottomColor: this.state.passwordMatch ? '#FFF' : "red"}]}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        placeholder="password"
                        placeholderTextColor={"#fff"}
                        secureTextEntry={true}
                    />
                </View>
                <View style={{flexDirection:"row",flex:1}}>
                    <TouchableOpacity onPress={() => this.props.Hide()} style={{alignSelf:"flex-start"}}>
                        <Text style={styles.textSignIn}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.Register()} style={{alignSelf:"flex-end"}}>
                        <Text style={styles.textSignIn}>Register</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )

    }
}
const styles = StyleSheet.create({
    SignInInput:{
        height: 40, 
        borderBottomColor: '#FFF',
        borderBottomWidth: 1,
        paddingBottom : 3,
        marginLeft: 10,
        marginRight:25,
        color:"#fff", 
        flex:0.8
    },
    textSignIn:{
        fontSize: RF(3),
        color: "white",
        padding: 8
    },
});
const mapStateToProps = state => {
    return {
       
    };
};
const mapDispatchToProps = {
    SignUp
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);