import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,TouchableHighlight,Button} from 'react-native';
import GridView from 'react-native-super-grid';
import GridItem from "../../Components/GridItems/GridItem/GridItem";
import InfiniteScroll from 'react-native-infinite-scroll';
import Orientation from 'react-native-orientation';
import Spinner from '../../../node_modules/react-native-gifted-spinner';
import CategoriesModal from './CategoriesModal/CategoriesModal';
import find from 'pouchdb-find';
import { connect } from 'react-redux'
import {
    GetBooksFromAPI,
    GetBooksFromLibrary,
    ClearBooks,
  } from '../../reducers/API/APIActions'
import {
    ToggleFilterDrawer,
    ToggleMainDrawer
} from '../../reducers/DrawerNavigation/DrawerNavigationActions'
import {
    loadSettings,
} from '../../reducers/Settings/SettingsActions'
import ToggleFilterDrawerButton from '../HeaderButtons/ToggleFilterDrawerButton/ToggleFilterDrawerButton';
import ToggleMainDrawerButton from '../HeaderButtons/ToggleMainDrawerButton/ToggleMainDrawerButton';
import { ENDPOINT } from '../../Values/Values';
import PouchDB from 'pouchdb-adapters-rn';
PouchDB.plugin(find)
const db = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
const chapters = new PouchDB('chapters', { adapter: 'pouchdb-adapters-rn'});
//const ItemSpacing = 6;
//const ItemsPerRow = 2;


class GridItems extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ToggleMainDrawerButton/>
            ),
            headerRight: (
                <ToggleFilterDrawerButton/>
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
    RefreshComponent =() =>{
        this.setState({items : [],loading : true,page : 0,Book : null,error: false,},() => this.LoadItems());
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
        this.setState({items : 
            this.props.category ? NextProps.CatalogBooks ? NextProps.CatalogBooks[this.props.category] : null : NextProps.CatalogBooks,
            error:NextProps.gettingBooksError,
            page:NextProps.CatalogPage,
            loading:NextProps.gettingBooks
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        if(this.props.category){
            if(nextState.items) return true
            return false
        }
        return true
     
    }
    componentWillMount() {
        this.props.loadSettings();
        const initial = Orientation.getInitialOrientation();
        let size = this.state.size;
        let ItemsPerRow = this.props.settings ? this.props.settings.LibraryLayoutSettings : "Default";
        if(ItemsPerRow != "Default"){
            ItemsPerRow = parseInt(ItemsPerRow)
            if (initial === 'PORTRAIT') {
                size = Math.floor(Dimensions.get('window').width/ItemsPerRow) - 10;
            } else {
                size = Math.floor(Dimensions.get('window').height/ItemsPerRow) - 10;
            }
        }else{
            size = 150
        } 
       
        this.setState({size : size,orientations:initial});
    }
    componentDidMount(){
        this.props.ClearBooks();
        this.setState({items : []})
        this.LoadItems();
    }
    showTagModal = (item) =>{
        if(this.props.isLibrary){
            this.setState({Book:item},() => this.CategoriesModal.toggleModal());
        }
    }
    
    render() {
        //console.log("update", this.props.category ? this.props.category : "Catalog",this.state.items)
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
                            spacing ={6}
                            style={styles.gridView}
                            renderItem={items => (
                                <TouchableHighlight  onPress={() => this.props.navigation.navigate('Details',{_id : items.doc._id})} 
                                    onLongPress={() => this.showTagModal(items.doc)}
                                    delayLongPress={1000}>
                                    <View style={[styles.ItemContainer,{height: 250}]} >
                                        <GridItem 
                                        source={{uri: ENDPOINT + "public/thumbnails/" + items.doc._id.replace(/[/\\?%*:|"<>. ]/g, '-') + "_s"}} 
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
                {this.state.loading ? <View styles={styles.retryButtoncontainer}><Spinner style={styles.Spinner}/></View> : null}
                {this.state.error ? <View styles={styles.retryButtoncontainer}>
                    <View style={styles.retryButton}>
                        <Button title="retry" onPress={this.LoadItems} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>
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
        position: 'absolute',
        left: (Dimensions.get('window').width / 2),
        top: (Dimensions.get('window').height / 2),
      } 
});
const mapStateToProps = state => {
    return {
        gettingBooks : state.Booker.gettingBooks,
        CatalogBooks : state.Booker.CatalogBooks,
        gettingBooksError : state.Booker.gettingBooksError,
        CatalogPage : state.Booker.CatalogPage,
        settings: state.Settings.Settings,
    };
};
const mapDispatchToProps = {
    GetBooksFromAPI,
    GetBooksFromLibrary,
    ToggleFilterDrawer,
    ToggleMainDrawer,
    loadSettings,
    ClearBooks,
};
export default connect(mapStateToProps, mapDispatchToProps)(GridItems);