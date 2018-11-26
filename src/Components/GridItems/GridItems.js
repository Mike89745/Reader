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

const db = new PouchDB('Library');

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
        page : 0
    }

    LoadItems = () => {
        let page = this.state.page + 1;
        if(this.props.isLibrary){
            db.allDocs().then((Response) => {
                this.setState({items : Response.rows, loading : false});
            }).catch(error => console.log(error));
        }else{
            this.setState({loading : true});
            
            axios.get('http://localhost:8000/getBooks/'+ page).then((response) => {
                data = this.state.items;
                response.data.rows.map(el => data.push(el));
                this.setState({items : data, loading : false,page:page});
            }).catch(error => console.log(error));;
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

    render() {
        let Grid = null;
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
                            <TouchableHighlight  onPress={() => this.props.navigation.navigate('Details',{_id : items.doc._id})} underlayColor="red">
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
        return (
            <View style={styles.container}>
                {Grid}
                {this.state.loading ? <View styles={styles.Spinner}><Spinner/></View> : null}
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