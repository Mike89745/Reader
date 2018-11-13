import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,TouchableHighlight,Button,Text} from 'react-native';
import GridView from 'react-native-super-grid';
import axios from 'react-native-axios';
import GridItem from "../../Components/GridItems/GridItem/GridItem";
import InfiniteScroll from 'react-native-infinite-scroll';
import Orientation from 'react-native-orientation';
import { DrawerActions } from 'react-navigation';
import Spinner from '../../../node_modules/react-native-gifted-spinner';
import ButtonIcon from "../Icon/Icon"
const ItemSpacing = 6;
const ItemsPerRow = 3;


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
       
    }

    LoadItems = () => {
        this.setState({loading : true});
        axios.request("https://mangareader-5f322.firebaseio.com/Thumbnails.json").then(Response => {
            let NewItems = Object.keys(Response.data).map(key => {return Response.data[key] ? Response.data[key] : null});
            let temp = [];
            for(let i of NewItems){
                i && temp.push(i);
            }
            const CurrentState = this.state.items;
            if(CurrentState != null){
                this.setState({items : [...CurrentState,...temp,...temp,...temp,...temp,...temp], loading : false});

            }else{
                this.setState({items : [...temp,...temp,...temp,...temp,...temp], loading : false});
            }
        })
        .catch(error => console.log(error));
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
                            <TouchableHighlight  onPress={() => this.props.navigation.navigate('Details')} underlayColor="red">
                                <View style={[styles.ItemContainer,{width:this.state.size},{height: this.state.size * 2}]} >
                                    <GridItem source={{uri: items.Link}} height={this.state.size * 2} width={this.state.size}/>
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