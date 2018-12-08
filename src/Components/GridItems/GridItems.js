import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,TouchableHighlight} from 'react-native';
import GridView from 'react-native-super-grid';
import axios from 'react-native-axios';
import GridItem from "../../Components/GridItems/GridItem/GridItem";
import InfiniteScroll from 'react-native-infinite-scroll';
import Orientation from 'react-native-orientation';
import { DrawerActions } from 'react-navigation';
import Spinner from '../../../node_modules/react-native-gifted-spinner';
import ButtonIcon from "../Icon/Icon"
import PouchDB from 'pouchdb-react-native';
import CategoriesModal from './CategoriesModal/CategoriesModal';
import find from 'pouchdb-find';
import Toast from 'react-native-simple-toast';
PouchDB.plugin(find)
const db = new PouchDB('Library');
const chapters = new PouchDB('chapters');
const ItemSpacing = 6;
const ItemsPerRow = 2;


export default  class GridItems extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                    
                />
            )
        };
      };
    state = {
        size : 100,
        items : [],
        loading : false,
        page : 0,
        Book : null,
    }

    LoadItems = () => {
        let page = this.state.page + 1;
        if(this.props.isLibrary){
            if(this.props.category === "Default"){
                db.allDocs({endkey: '_design'}).then((Response) => {
                    this.setState({items : Response.rows, loading : false});
                }).catch(error => console.log(error));
            }
            else{
                let categories = [];
                categories.push(this.props.category);
                db.createIndex({
                        index: {
                            fields: ["_id",'categories','tags']
                        }
                }).then(() => {
                        return db.find({
                            selector: {
                                categories: {$in : categories}
                            }
                        }).then(res => {
                            
                            let items = [];
                            res.docs.map(docs => items.push({doc : docs}))
                            this.setState({items : items});
                        })
                }).catch((err) => console.log(err,"griditems createIndex error"));
            }
        }else{
            this.setState({loading : true});
            
            axios.get('http://localhost:8000/getBooks/'+ page).then((response) => {
                data = this.state.items;
                response.data.rows.map(el => data.push(el));
                this.setState({items : data, loading : false,page:page});
            }).catch(error => {
                console.log(error,"Catalog")
                //Toast.show(error, Toast.LONG)
            });
        }
      
    }
   
    componentWillMount() {
       // console.log(this.props.nav,this.props.navigation);
        const initial = Orientation.getInitialOrientation();
        let size = this.state.size;
        if (initial === 'PORTRAIT') {
            size = Math.floor(Dimensions.get('window').width/ItemsPerRow) - 10;
        } else {
            size = Math.floor(Dimensions.get('window').height/ItemsPerRow) - 10;
        }
        this.setState({size : size,orientations:initial});
    }
    componentDidMount(){
       this.LoadItems();
    }
    showTagModal = (item) =>{
        if(this.props.isLibrary){
            this.setState({Book:item},() => this.CategoriesModal.toggleModal());
        }
    }
    render() {
        let Grid = null;
        if(this.state.items){
            if(this.state.items.length > 0){
                Grid = ( <InfiniteScroll
                    horizontal={false}  
                    onLoadMoreAsync={this.LoadItems}
                    distanceFromEnd={10}
                    >
                        <GridView
                            itemDimension={this.state.size}
                            items={[...this.state.items]}
                            spacing ={ItemSpacing}
                            style={styles.gridView}
                            renderItem={items => (
                                <TouchableHighlight  onPress={() => this.props.navigation.navigate('Details',{_id : items.doc._id})} 
                                    onLongPress={() => this.showTagModal(items.doc)}
                                    delayLongPress={1000}>
                                    <View style={[styles.ItemContainer,{height: 250}]} >
                                        <GridItem 
                                        source={{uri: "http://localhost:8000/public/thumbnails/" + items.doc._id.replace(/[/\\?%*:|"<>. ]/g, '-')}} 
                                        title={items.doc._id}/>
                                    </View>
                                </TouchableHighlight>
                            )}  
                        />
                    </InfiniteScroll>
                );
            }
        }
        return (
            <View style={styles.container}>
                {Grid}
                {this.state.loading ? <View styles={styles.Spinner}><Spinner/></View> : null}
                {this.state.Book ? <CategoriesModal 
                    ref={(ref) => { this.CategoriesModal = ref; }} 
                    Book={this.state.Book ? this.state.Book._id : null} 
                    currentCategories={this.state.Book ? this.state.Book.categories : null}
                /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#FFF",
        alignSelf: 'stretch',
    },
    ItemContainer: {
        flex: 1,
        backgroundColor : "#FFF",
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        maxHeight: 250,
    }, 
    gridView: {
        paddingTop: 10,
        flex: 1,
    },
    
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    Spinner : {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        flex : 1,
        height: Dimensions.get("window").height
    } 
});