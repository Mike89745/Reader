import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,Button,Text,ScrollView } from 'react-native';
import Info from "./Info/Info";
import ThumbNail from "./ThumbNail/ThumbNail";
import axios from 'react-native-axios';
import Description from "./Description/Description";
import TagList from "./TagList/TagList";
import Tabs from "./Tabs/Tabs";
import Spinner from 'react-native-gifted-spinner';
import ButtonIcon from '../Icon/Icon';
import PouchDB from 'pouchdb-react-native';

const Library = new PouchDB('Library');
const Chapters = new PouchDB('Chapters');

export default class Detail extends Component {
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
            headerTitle: ( <Text style={{color: "#fff"}}> {params ? params.title : ''}</Text> ),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
        };
      };
    state ={
        info : " ",
        inLibrary : false,
        infoLoading : false,
        size : 150,
        height : 0,
    }
    getInfo = () => {
       // console.log(this.props.navigation.getParam("_id",null))
        axios.get('http://localhost:8000/getBook/' + this.props.navigation.getParam("_id",null)).then((response) => {
            this.setState({info : response.data.docs, infoLoading : false,inLibrary:false,added:false});
            this.props.navigation.setParams({title:response.data.docs[0]._id});
        }).catch(error => console.log(error));;
        /*Library.get(this.props._id ? this.props._id : "Marry Grave").then((response) => {
            this.setState({info : response, infoLoading : false,inLibrary:true,added:true});
            this.props.navigation.setParams({title: response.Name});
        }).catch((error) => {
            if(error.status == 404){
                this.setState({infoLoading : true});
                Axios.request("https://mangareader-5f322.firebaseio.com/Info.json").then(Response => {
                    this.setState({info : Response.data, infoLoading : false,inLibrary:false,added:false});
                    this.props.navigation.setParams({title: Response.data.Name});
                })
                .catch(error => console.log(error));
            }
        });*/
      
    }
    componentDidMount(){
        this.getInfo();
        let size = this.state.size;
        let height = Math.floor(Dimensions.get('window').height/3);
        if(Dimensions.get('window').width < 500){
            size = 150;
        }else{
            size = Math.floor(Dimensions.get('window').width/3) - 10;
        }
        this.setState({size : size, height: height});
    }
    addToLibrary = () => {
       /* console.log(this.state.info[0]._id,"add");
        Library.get(this.state.info[0]._id).then((response) => {
            console.log(response,"get");
        }).catch((error) => {
            console.log(error)
            if(error.status == 404){
                console.log("addToLibrary");
                const book = this.state.info;
              
                console.log(book);
                Library.put(book).then((response) => {
                    console.log(response);
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });
       */
       
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <ScrollView>
                {this.state.loading ? <Spinner style={styles.Spinner}/> :
                <View> 
                    <View style={{flexDirection : "row",padding: 10, height : this.state.height, backgroundColor: "#Dee"}}>
                        <View style={{width : this.state.size,paddingRight: 10}}>
                            <ThumbNail source={this.state.info[0].source}/>
                        </View>
                        <Info style={styles.Info} info={this.state.info[0]}/>
                    </View>
                    <View style={styles.content}>
                        <Description description={this.state.info[0].description}/>
                        <View style={{flex:1,alignSelf:"flex-end",flexDirection:"row",paddingTop: 8}}>
                            <ButtonIcon name={this.state.added ? "bookmark-minus" : "bookmark-plus"} backgroundColor="#3b424c" borderRadius={50} Color="#fff" onPress={() => this.addToLibrary()}/>
                        </View>
                        <TagList tags={this.state.info[0].tags}/>
                    </View>
                    <Tabs/>
                </View>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    content:{
        flex: 1,
        padding: 10,
    },
    ThumbNail:{
        flex : 2,
        marginRight : 10,
    },
    Info :{
        flex : 1,
    }, 
    Spinner : {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});