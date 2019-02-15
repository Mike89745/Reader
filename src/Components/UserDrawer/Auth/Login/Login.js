import React, { Component } from 'react';
import { StyleSheet,View,Text,TouchableOpacity,Animated,TextInput} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { connect } from 'react-redux'
import {SignIn} from "../../../../reducers/User/UserActions"
class Login extends Component {
    state = {
        email:null,
        password:null,
    }
    render() {
        return (
            <Animated.View>
                <View style={{flex:1}}>
                    <TextInput
                        style={styles.SignInInput}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        placeholder="Email"
                        placeholderTextColor={"#fff"}
                    />
                </View>
                <View style={{flex:1}}>
                    <TextInput
                        style={styles.SignInInput}
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
                    <TouchableOpacity onPress={() => this.props.SignIn(this.state.email,this.state.password)} style={{alignSelf:"flex-end"}}>
                        <Text style={styles.textSignIn}>Login</Text>
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
    SignIn
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);