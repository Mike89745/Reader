import React, { Component } from 'react';
import { StyleSheet, TextInput,ScrollView,View,Text,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize"
import GridView from 'react-native-super-grid';
import TriStateCheckBox from './TriStateCheckbox/TriStateCheckbox';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux'
import {
    SearchBooksFromAPI,
    SearchBooksFromLibrary,
} from '../../reducers/API/APIActions'
import {
    setFilterDrawer,
    ToggleFilterDrawer,
} from '../../reducers/DrawerNavigation/DrawerNavigationActions'
/**Pravé vytahovací menu sloužící k vyhledávání v katalogu a knihovně. */
class FilterDrawer extends Component {
    state = {
        CheckboxRefs : [],
        text: "",
        ActiveRoute : null,
        tags : ["4-Koma","Action","Adventure","Award Winning","Comedy","Cooking","Doujinshi","Drama","Ecchi","Fanstasy","Gender Bender","Harem","Historical","Horror","Isekai","Josei","Martial Arts","Mecha","Medical","Music","Mystery","Oneshot","Psychological","Romance","School Life","Sci-Fi","Seinen","Shoujo","Shoujo Ai","Shounen","Slice of life","Smut","Sports","Supernatural","Tragedy","Webtoon","Yuri","Game"]
    }
    /**
     * Kontroluje jestli je text prázdný nebo jen mezery, pokud ano vrací true.
     * @param {*} str Text k zkontrolování
     */
    isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    /**
     * Nastavuje Redux state prop ActiveRoute na state prop.
     */
    componentWillReceiveProps(NextProps){
        this.setState({ActiveRoute : NextProps.ActiveRoute});
    }
    /**
     * Zjistí jaké CheckBoxy jsou zaškrtlé a jaký je jeho typ zaškrtnutí  (checked,unchecked,indeterminate) 
     * a podle ActiveRoute zjistí jestli se vyhledává v knihovně nebo v katalog 
     * a zavolá Redux metodu SearchBooksFromLibrary nebo SearchBooksFromAPI.
     */
    Search=()=>{
       
        let CheckedTags = [];
        let IndeterminateTags = [];
        this.state.tags.map(tag => {
            this.tagsRefs[tag].isChecked() ? CheckedTags.push( this.tagsRefs[tag].getID()) :  this.tagsRefs[tag].isIndeterminate() ? IndeterminateTags.push( this.tagsRefs[tag].getID()) : null;
        })
        this.state.ActiveRoute ? this.state.ActiveRoute === "Library" ? 
            this.props.SearchBooksFromLibrary(this.state.text,CheckedTags,IndeterminateTags) 
        :
            this.props.SearchBooksFromAPI(this.state.text,CheckedTags,IndeterminateTags) : null;
        this.props.ToggleFilterDrawer();
    }
    /**
     * Nastaví Drawer (vytahovací menu) do Redux statu pomocí Redux metody setFilterDrawer.
     */
    componentWillMount(){
        this.props.setFilterDrawer(this.props.navigation);
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
                                    onChangeText={(text) => this.setState({text})}
                                    value={this.state.text}
                                    placeholder="Search..."
                                />
                            </View>
                            <GridView
                                itemDimension={100}
                                items={[...this.state.tags]}
                                spacing ={2}
                                style={styles.gridView}
                                ref="REF-FLATLIST"
                                renderItem={(items,index) => (
                                    <TriStateCheckBox text={items}  ref={(ref) => this.tagsRefs = {...this.tagsRefs, [`${items}`]: ref}}/>
                                )}  
                            />
                            <View style={{flex:1,alignSelf:"flex-end",}}>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity onPress={() => this.Search()} >
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
const mapStateToProps = state => {
    return {
        ActiveRoute : state.DrawerNav.ActiveRoute
    };
};
const mapDispatchToProps = {
    SearchBooksFromAPI,
    setFilterDrawer,
    SearchBooksFromLibrary,
    ToggleFilterDrawer,
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterDrawer);