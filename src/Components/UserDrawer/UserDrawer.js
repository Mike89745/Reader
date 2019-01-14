import React, { Component } from 'react';
import { StyleSheet, TextInput,ScrollView,View,Text,TouchableOpacity,Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import {
    setMainDrawer,
} from '../../reducers/DrawerNavigation/DrawerNavigationActions'
import {SignIn,LoadUser} from "../../reducers/User/UserActions"
import Spinner from '../../../node_modules/react-native-gifted-spinner';
class UserDrawer extends Component {
    state = {
        user : null,
        ActiveRoute: null,
        signingIn : false,
        signingInError : false,
        UserContainer: null,
        email:null,
        password:null,
    }
    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    navigateTo(routeName){
       
        this.props.navigation.navigate(routeName);
        this.setState({ActiveRoute : routeName});
    }
    componentWillReceiveProps(nextProps){
        this.setState({user : nextProps.user,signingIn: nextProps.signingIn,signingInError : nextProps.signingInError})
    }
    componentDidMount(){
        this.props.LoadUser();
        this.props.setMainDrawer(this.props.navigation);
        let navState =this.props.navigation.state;
        this.setState({ActiveRoute : navState.routes[navState.index].routeName});
    }
    render() {
        console.log(this.state.UserContainer)
        return (
            <ScrollView>
                <SafeAreaView style={{padding:0}} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={styles.container}>
                       
                       {this.state.user ? 
                       <View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}>
                            <Text>{this.state.user.nick}</Text>
                            <TouchableOpacity onPress={() => this.props.singOut} style={{alignSelf:"flex-end"}}>
                                <Text style={styles.textSignIn}>Sign out</Text>
                            </TouchableOpacity>
                              
                       </View> 
                       
                       : 

                       <View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}  onLayout={(event) => {
                       this.setState({UserContainer : [event.nativeEvent.layout.width,event.nativeEvent.layout.height]});
                        }}>
                            
                            <View>
                                <TextInput
                                    style={{height: 40, borderBottomColor: '#3b424c',borderBottomWidth: 2,marginLeft: 10,marginRight:25,width:150}}
                                    onChangeText={(email) => this.setState({email})}
                                    value={this.state.email}
                                    placeholder="Email"
                                    placeholderTextColor={"#fff"}
                                />
                            </View>
                            <View>
                            <TextInput
                                    style={{height: 40, borderBottomColor: '#3b424c',borderBottomWidth: 2,marginLeft: 10,marginRight:25,width:150}}
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}
                                    placeholder="password"
                                    placeholderTextColor={"#fff"}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View style={{flex:1,flexDirection:"row"}}>
                                <TouchableOpacity onPress={() => console.log("sign in")} style={{alignSelf:"flex-start"}}>
                                    <Text style={styles.textSignIn}>Sign Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.SignIn(this.state.email,this.state.password)} style={{alignSelf:"flex-end"}}>
                                    <Text style={styles.textSignIn}>Sign in</Text>
                                </TouchableOpacity>
                            </View>
                           
                       </View>
                        }
                         {this.state.signingIn ?  this.state.UserContainer ? 
                            <Spinner style={[styles.Spinner,{width: this.state.UserContainer[0],height: this.state.UserContainer[1]}]}/>
                        :null: null}
                       <View>
                            <TouchableOpacity onPress={() => this.navigateTo("Library")} >
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "Library" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                                    <View style={{marginLeft: 10, marginRight:25}}>
                                        <Icon  name={"book"}
                                            color = {"#000" }
                                            backgroundColor={"rgba(120,120,120,0)" }
                                            borderRadius={0}
                                            iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                            size = {20}/>
                                    </View>    
                                    <Text style={styles.textStyle}>Library</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.navigateTo("Catalog")} >
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "Catalog" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                                    <View style={{marginLeft: 10, marginRight:25}}>
                                        <Icon  name={"table"}
                                            color = {"#000" }
                                            backgroundColor={"rgba(120,120,120,0)" }
                                            borderRadius={0}
                                            iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                            size = {20}/>
                                    </View>
                                    <Text style={styles.textStyle}>Catalog</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.navigateTo("History")} >
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "History" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                                    <View style={{marginLeft: 10, marginRight:25}}>
                                        <Icon  name={"book-open-variant"}
                                            color = {"#000" }
                                            backgroundColor={"rgba(120,120,120,0)" }
                                            borderRadius={0}
                                            iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                            size = {20}/>
                                    </View>
                                    <Text style={styles.textStyle}>History</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.navigateTo("Download")} >
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "Download" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                                    <View style={{marginLeft: 10, marginRight:25}}>
                                        <Icon  name={"download"}
                                            color = {"#000" }
                                            backgroundColor={"rgba(120,120,120,0)" }
                                            borderRadius={0}
                                            iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                            size = {20}/>
                                    </View>
                                    <Text style={styles.textStyle}>Downloads</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.navigateTo("Settings")} >
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "Settings" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                                    <View style={{marginLeft: 10, marginRight:25}}>
                                        <Icon  name={"settings"}
                                            color = {"#000" }
                                            backgroundColor={"rgba(120,120,120,0)" }
                                            borderRadius={0}
                                            iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                            size = {20}/>
                                    </View>
                                    <Text style={styles.textStyle}>Settings</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
        </ScrollView>
        )

    }
}
const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    container:{
        flex:1,
        position: "relative"
    },
    textStyle:{
        fontSize: RF(3),
        color: "black",
        padding: 8
    },
    textSignIn:{
        fontSize: RF(3),
        color: "white",
        padding: 8
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
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
        signingInError : state.UserReducer.error,
    };
};
const mapDispatchToProps = {
    setMainDrawer,
    SignIn,
    LoadUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDrawer);