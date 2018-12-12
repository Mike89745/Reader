import React, { Component } from 'react';
import { StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RF from "react-native-responsive-fontsize";
import ButtonIcon from '../Icon/Icon';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
export default class Settings extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ToggleMainDrawerButton/>
            ),
            drawerLockMode: 'locked-closed',
        };
      };
    navigateTo(route){
        this.props.navigation.navigate(route);
    }
    render() {
        return (
            <View>
                <View>
                    <TouchableOpacity onPress={() => this.navigateTo("GeneralSettings")} >
                        <View style={{flexDirection:"row",alignItems: 'center',padding:5,borderBottomColor:"rgba(59,66,76,0.5)", borderBottomWidth: 1}}>
                            <View style={{marginLeft: 10, marginRight:25}}>
                                <Icon  name={"information"}
                                    color = {"#3b424c" }
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                    size = {25}/>
                            </View>    
                            <Text style={styles.textStyle}>General Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.navigateTo("ReaderSettings")} >
                        <View style={{flexDirection:"row",alignItems: 'center',padding:5,borderBottomColor:"rgba(59,66,76,0.5)", borderBottomWidth: 1}}>
                            <View style={{marginLeft: 10, marginRight:25}}>
                                <Icon  name={"book-open"}
                                    color = {"#3b424c" }
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                    size = {25}/>
                            </View>    
                            <Text style={styles.textStyle}>Reader Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.navigateTo("DownloaderSettings")} >
                        <View style={{flexDirection:"row",alignItems: 'center',padding:5,borderBottomColor:"rgba(59,66,76,0.5)", borderBottomWidth: 1}}>
                            <View style={{marginLeft: 10, marginRight:25}}>
                                <Icon  name={"download"}
                                    color = {"#3b424c" }
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                    size = {25}/>
                            </View>    
                            <Text style={styles.textStyle}>Dowloader Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.navigateTo("AdvancedSettings")} >
                        <View style={{flexDirection:"row",alignItems: 'center',padding:5,borderBottomColor:"rgba(59,66,76,0.5)", borderBottomWidth: 1}}>
                            <View style={{marginLeft: 10, marginRight:25}}>
                                <Icon  name={"code-tags"}
                                    color = {"#3b424c" }
                                    backgroundColor={"rgba(120,120,120,0)" }
                                    borderRadius={0}
                                    iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                    size = {25}/>
                            </View>    
                            <Text style={styles.textStyle}>Advanced Settings</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#ccc"
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        flex: 1,
        padding: 15,
    },
    textHeader:{
        padding: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});