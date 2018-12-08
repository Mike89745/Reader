import React, { Component } from 'react';
import { StyleSheet, TextInput,ScrollView,View,Text,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize"
import GridView from 'react-native-super-grid';
import TriStateCheckBox from './TriStateCheckbox/TriStateCheckbox';
import { DrawerItems, SafeAreaView } from 'react-navigation';
export default class FilterDrawer extends Component {
    state = {
        tags : ["4-Koma","Action","Adventure","Award Winning","Comedy","Cooking","Doujinshi","Drama","Ecchi","Fanstasy","Gender Bender","Harem","Historical","Horror","Isekai","Josei","Martial Arts","Mecha","Medical","Music","Mystery","Oneshot","Psychological","Romance","School Life","Sci-Fi","Seinen","Shoujo","Shoujo Ai","Shounen","Slice of life","Smut","Sports","Supernatural","Tragedy","Webtoon","Yuri","Game"]
    }
    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
   
    render() {
        return (
            <ScrollView>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={styles.container}>
                        <View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}>
                            <Text style={[styles.textHeader,{padding:5,paddingBottom:10,color:"white"}]}>Search</Text>
                        </View>
                        <View style={{padding:10}}>
                            <View style={{flex: 1, flexWrap: 'wrap',}}>
                                <TextInput
                                    style={{height: 40, borderBottomColor: '#3b424c',borderBottomWidth: 2,marginLeft: 10,marginRight:25,width:200, marginBottom: 10}}
                                    onChangeText={(CategoryName) => this.setState({CategoryName})}
                                    value={this.state.text}
                                    placeholder="Search..."
                                />
                            </View>
                            <GridView
                                itemDimension={100}
                                items={[...this.state.tags]}
                                spacing ={2}
                                style={styles.gridView}
                                renderItem={items => (
                                <TriStateCheckBox text={items}/>
                                )}  
                            />
                            <View style={{flex:1,alignSelf:"flex-end",}}>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => this.toggleModal()} >
                                        <Text style={styles.textStyle}>Search</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        fontSize: RF(2.5),
        color: "black",
        padding: 8
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});