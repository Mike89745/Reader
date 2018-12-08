import React, { Component } from 'react';
import { StyleSheet, TextInput,ScrollView,View,Text,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerItems, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class UserDrawer extends Component {
    state = {
        user : null,
        ActiveRoute: null
    }
    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    navigateTo(routeName){
        this.props.navigation.navigate(routeName)
        this.setState({ActiveRoute : routeName});
    }
    componentDidMount(){
        let navState =this.props.navigation.state;
        this.setState({ActiveRoute : navState.routes[navState.index].routeName});
    }
    render() {
        return (
            <ScrollView>
                <SafeAreaView style={{padding:0}} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={styles.container}>
                       {this.state.user ? null : <View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}>
                            <TouchableOpacity onPress={() => console.log("sign in")} >
                                <Text style={styles.textSignIn}>Sign in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log("Sign in with Google")} >
                                <Text style={styles.textSignIn}>Sign in with Google</Text>
                            </TouchableOpacity>
                       </View>
                        }
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
                                <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === "Download" ? " rgba(59,66,76,0.5)" : null,padding:5}}>
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
        flex:1
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
    }
});