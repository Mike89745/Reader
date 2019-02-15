import React, { Component } from 'react';
import RF from "react-native-responsive-fontsize"
import {View, Text,FlatList} from 'react-native';
import LibraryCategoryItem from './LibraryCategoryItem/LibraryCategoryItem';
import LibraryCategoriesModal from './LibraryCategoriesModal/LibraryCategoriesModal';
import ButtonIcon from '../../Icon/Icon';
import PouchDB from 'pouchdb-adapters-rn';
const db = new PouchDB('categories', { adapter: 'pouchdb-adapters-rn'});
export default class LibraryCategories extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerTitle: ( <Text style={{color: "white"}}>Categories</Text> ),
            headerLeft: <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
            
        };
      };
    state = {
        categories : [],
    }
    addCategory = (category) =>{
        db.put({_id : category}).then(res => console.log(res)).catch(err => console.log(err,"added category err"));
        this.loadCategories();
    }
    removeCategory = (category) =>{
        db.get(category.id).then(category => {
            db.remove(category).then(res =>{ 
                this.loadCategories();
            }).catch(err => console.log(err,"remove category err"))}
        ).catch(err => console.log(err,"get err"));
    }
    loadCategories(){
        db.allDocs().then(res =>{
            this.setState({categories:res.rows});
        }).catch(err => console.log(err,"categories err"));
    }
    ShowModal=()=>{
        this.categoriesModal.toggleModal();
    }
    componentWillMount(){
        this.loadCategories()
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList 
                    scrollEventThrottle={16}
                    ref={(ref) => { this.ScrollRef = ref; }}
                    data={this.state.categories}
                    removeClippedSubviews={true}
                    renderItem={({item}) => <LibraryCategoryItem removeCategory={this.removeCategory} category={item.id} item={item}/>}
                />
                <View style={{position:"absolute", right: 15, bottom: 15,height:50}}>
                    <ButtonIcon name={"tag-plus"} backgroundColor="#3b424c" borderRadius={50} Color="#fff" onPress={() => this.ShowModal()}/>
                </View>
                    <LibraryCategoriesModal ref={(ref) => { this.categoriesModal = ref; }} addCategory={this.addCategory}/>
                
            </View>
        )

    }
}