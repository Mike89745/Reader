import React, { Component } from 'react';
import { StyleSheet,View,Text,TouchableOpacity,Animated} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { connect } from 'react-redux'
import Spinner from '../../../../node_modules/react-native-gifted-spinner';
import Login from "./Login/Login"
import Register from "./Register/Register"
import User from "./User/User"
class Auth extends Component {
    state = {
        signingIn : false,
        signingUp: false,
        signingInError : false,
        AuthMsg : null,

        UserContainer: null,
        signIn: false,
        signUp: false,
    }
    Hide =()=>{
        this.setState({signIn:false,signUp:false});
    }
    ShowLogin =()=>{
        if(!this.state.signIn){
            this.setState({signIn:true});
          
        }else{
            this.setState({signIn:false});
           
        }
    }
    ShowRegister=()=>{
        if(!this.state.signUp){
            this.setState({signUp:true});
        }else{
            this.setState({signUp:false});
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({user : nextProps.user,signingIn: nextProps.signingIn,signingInError : nextProps.signingInError,AuthMsg: nextProps.AuthMsg})
        if(!nextProps.signingInError && !nextProps.signingUp){
            this.Hide();
        }
    }
    render() {
        return (
            <View style={styles.container}>
            {this.state.user ? <User user={this.state.user}></User>
           : 
            <View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}  
                onLayout={(event) => {this.setState({UserContainer : [event.nativeEvent.layout.width,event.nativeEvent.layout.height]});}}>

                {this.state.signIn ? <Login Hide={this.Hide}></Login> : null}
                {this.state.signUp ? <Register Hide={this.Hide}></Register> : null}
                {this.state.AuthMsg ? <Text style={styles.textSignIn}>{this.state.AuthMsg}</Text> : null}
                {this.state.signIn || this.state.signUp ? null :
                    <View style={{flex:1,flexDirection:"row"}}>
                        <TouchableOpacity onPress={() => this.ShowRegister()} style={{alignSelf:"flex-start"}}>
                            <Text style={styles.textSignIn}>Register</Text>
                        </TouchableOpacity>

                        <View>
                            <Text style={styles.textSignIn}> or </Text>
                        </View>
                        
                        <TouchableOpacity onPress={() => this.ShowLogin()} style={{alignSelf:"flex-end"}}>
                            <Text style={styles.textSignIn}>Login</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            }
            {this.state.signingIn ?  this.state.UserContainer ? 
                <Spinner style={[styles.Spinner,{width: this.state.UserContainer[0],height: this.state.UserContainer[1]}]}/>
            :null: null}
        </View>
        )

    }
}
const styles = StyleSheet.create({
  
  
    container:{
        flex:1,
        position: "relative"
    },
    
    textSignIn:{
        fontSize: RF(3),
        color: "white",
        padding: 8
    },
    Spinner : {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    } 
});
const mapStateToProps = state => {
    return {
        user : state.UserReducer.user,
        signingIn : state.UserReducer.signingIn,
        signingUp :  state.UserReducer.signingUp,
        signingInError : state.UserReducer.error,
        AuthMsg : state.UserReducer.msg,
    };
};
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);