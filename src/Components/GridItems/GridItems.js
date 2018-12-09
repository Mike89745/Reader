import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,TouchableHighlight,Button} from 'react-native';
import GridView from 'react-native-super-grid';
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
import { connect } from 'react-redux'
import {
    GetBooksFromAPI,
    GetBooksFromLibrary
  } from '../../reducers/API/APIActions'
PouchDB.plugin(find)
const db = new PouchDB('Library');
const chapters = new PouchDB('chapters');
const ItemSpacing = 6;
const ItemsPerRow = 2;


class GridItems extends Component {
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
        loading : true,
        page : 0,
        Book : null,
        error: false,
    }

    LoadItems = () => {
        let page = this.state.page + 1;
        if(this.props.isLibrary){
           this.props.GetBooksFromLibrary(this.props.category)
        }else{
            this.props.GetBooksFromAPI(page)
        }
      
    }
    componentWillReceiveProps(NextProps){
        this.setState({items : this.props.category ? NextProps.CatalogBooks ? NextProps.CatalogBooks[this.props.category] : null : NextProps.CatalogBooks,error:NextProps.gettingBooksError,page:NextProps.CatalogPage,loading:NextProps.gettingBooks})
    }
    shouldComponentUpdate(nextProps, nextState){
        if(this.props.category){
            if(nextState.items) return true
            return false
        }
        return true
     
    }
    componentWillMount() {
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
        console.log("update", this.props.category ? this.props.category : "Catalog",this.state.items)
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
                {this.state.error ? <View styles={styles.retryButtoncontainer}>
                    <View style={styles.retryButton}>
                        {this.state.loading ? <View styles={styles.Spinner}><Spinner/></View> : <Button title="retry" onPress={this.LoadItems} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>} 
                    </View>
                </View> : null}
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
    retryButtoncontainer:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1
    },
    retryButton: {
        width:100,
        height:50,
       
        position: 'absolute',
        left: (Dimensions.get('window').width / 2) - 50,
        top: (Dimensions.get('window').height / 2) - 75,
        
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
        justifyContent: 'center', 
        alignItems: 'center',
        flex : 1,
    } 
});
const mapStateToProps = state => {
    return {
        gettingBooks : state.Booker.gettingBooks,
        CatalogBooks : state.Booker.CatalogBooks,
        gettingBooksError : state.Booker.gettingBooksError,
        CatalogPage : state.Booker.CatalogPage
    };
};
const mapDispatchToProps = {
    GetBooksFromAPI,
    GetBooksFromLibrary
};
export default connect(mapStateToProps, mapDispatchToProps)(GridItems);