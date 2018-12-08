import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RF from "react-native-responsive-fontsize";
import ButtonIcon from '../../Icon/Icon';
export default class AdvancedSettings extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
                
                shadowColor: "#fff",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity:0,
                shadowRadius: 0,

                elevation: 0,
              },
            headerTitle: ( <Text style={{color: "#fff"}}> Advanced Settings</Text> ),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
        };
      };
   
    render() {
        return (
            <View>
                <Text style={styles.textHeader}>Advanced Settings</Text>
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
        fontSize: RF(3.5),
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