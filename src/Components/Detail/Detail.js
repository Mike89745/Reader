import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,Button,Text,ScrollView } from 'react-native';
import Info from "./Info/Info";
import Thumbnail from "./Thumbnail/Thumbnail";
import Description from "./Description/Description";
import TagList from "./TagList/TagList";
import Tabs from "./Tabs/Tabs";
import Spinner from 'react-native-gifted-spinner';
import ButtonIcon from '../Icon/Icon';
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import SelectHeader from './Tabs/ChapterList/Chapter/SelectHeader/SelectHeader';
import { connect } from 'react-redux'
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from "react-native-fs";
import {
    toggleSelectHeader,
    clearChapters
  } from '../../reducers/downloader/downloaderActions'
import CategoriesModal from '../GridItems/CategoriesModal/CategoriesModal';
import SimpleToast from '../../../node_modules/react-native-simple-toast';
import { ENDPOINT } from '../../Values/Values';
import DetailHeaderRight from './DetailHeaderRight/DetailHeaderRight';
PouchDB.plugin(find)
const Library = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});

class Detail extends Component {
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
            drawerLockMode : "locked-closed",
            headerTitle: ( <View style={{width: Math.round(Dimensions.get("screen").width/1.5)}}><Text style={{color: "#fff"}}>{params ? params.title : ''}</Text></View>),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
            headerRight : <DetailHeaderRight bookID={params ?params.title : null}></DetailHeaderRight>
        };
      };
    state ={
        info : null,
        inLibrary : false,
        infoLoading : false,
        size : 150,
        height : 0,
        added : false,
        error: false,
        selectHeaderVisible : false,
    }
   
    getInfo = () => {
        
        Library.get(this.props.navigation.getParam("_id",null)).then((response) => {
            let data = [];
            data.push(response)
            this.setState({info : data, infoLoading : false,inLibrary:true,added:true});
            this.props.navigation.setParams({title: data[0]._id});
        }).catch((error) => {
            if(error.status == 404){
                this.setState({infoLoading : true});
                fetch(ENDPOINT + 'getBook/' + this.props.navigation.getParam("_id",null)).then(response =>{
                    return response.json()
                }).then((response) => {
                    this.setState({info : response.docs, infoLoading : false,inLibrary:false,added:false,error:false});
                    this.props.navigation.setParams({title:response.docs[0]._id});
                }).catch(error => {
                    SimpleToast.show("Error getting Book, please Try again",SimpleToast.LONG);
                    this.setState({error:true})
                    console.log(error);
                });
            }
        });
      
    }
    componentWillReceiveProps(nextProps){
        this.setState({selectHeaderVisible : nextProps.selectHeaderVisible})
    }
    componentDidMount(){
        this.props.clearChapters();
        this.props.selectHeaderVisible ? this.props.toggleSelectHeader() : null;
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
    componentWillUnmount(){
        this.state.selectHeaderVisible ? this.props.toggleSelectHeader() : null;
    }
    addToLibrary = () => {
        const book = this.state.info[0];
        Library.get(book._id).then((response) => {
            Library.remove(response).then(response =>{
                this.setState({added : false});
            }).catch((err) => {
                SimpleToast.show("Error removing from library, this shouldnt happen",SimpleToast.LONG);
                console.log(err,"delete");
            });
        }).catch((error) => {
            if(error.status == 404){
                
                const book ={
                    _id :book._id, 
                    author :  book.author,
                    artist :  book.artist,
                    rating : book.rating,
                    status : book.status,
                    description : book.description,
                    tags: book.tags,
                    categories: [],
                    lastRead: null,
                }
                Library.put(book).then((response) => {
                    this.CategoriesModal.toggleModal();
                    this.saveThumbnail(book._id.replace(/[/\\?%*:|"<>. ]/g, '-')) 
                    this.setState({added : true,error:false});
                }).catch((err) => {
                    SimpleToast.show("Error saving book, this shouldnt happen",SimpleToast.LONG);
                });
            }
        });
    }
    saveThumbnail(bookID){
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/Thumbnails`).then(response => {
            if(!response) { 
                RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/Thumbnails`);
            }
        });
        let task = RNBackgroundDownloader.download({
            id: "//"+ bookID + "//Thumbnail",
            url: `${ENDPOINT}public/Thumbnails/${bookID}`,
            destination: `${RNFS.DocumentDirectoryPath}/Thumbnails/${bookID}.jpg`
          }).begin((expectedBytes) => {
          }).progress((percent) => {
          }).done(() => {
              console.log(`${RNFS.DocumentDirectoryPath}/Thumbnails/${bookID}.jpg`)
          }).error((error) => {
              
          });
    }
    
    render() {
        return (
            <View> 
                <ScrollView>
                    {this.state.info ? 
                    <View> 
                        <View style={{flexDirection : "row",padding: 10, height : this.state.height}}>
                            <View style={{width : this.state.size,paddingRight: 10}}>
                                <Thumbnail 
                                source={this.state.added ? 
                                {uri : `file://${RNFS.DocumentDirectoryPath}/Thumbnails/${this.state.info[0]._id.replace(/[/\\?%*:|"<>. ]/g, '-')}.jpg`}
                                :
                                {uri: (ENDPOINT + "public/Thumbnails/") + this.state.info[0]._id.replace(/[/\\?%*:|"<>. ]/g, '-')}}
                                />
                            </View>
                            <Info style={styles.Info} info={this.state.info[0]}/>
                        </View>
                        <View style={styles.content}>
                            <Description description={this.state.info[0].description}/>
                            <View style={{flex:1,alignSelf:"flex-end",flexDirection:"row",paddingTop: 0}}>
                                <ButtonIcon name={this.state.added ? "bookmark-minus" : "bookmark-plus"} backgroundColor="#3b424c" borderRadius={50} Color="#fff" onPress={() => this.addToLibrary()}/>
                            </View>
                            <TagList tags={this.state.info[0].tags}/>
                        </View>
                        {this.state.selectHeaderVisible ? <View>
                            <SelectHeader/>
                        </View> : null}
                        <Tabs bookID={this.state.info[0]._id} nav={this.props.navigation}/>
                        
                    </View>
                    :
                    <Spinner style={styles.Spinner}/>
                    }
                </ScrollView>
                <CategoriesModal 
                    ref={(ref) => { this.CategoriesModal = ref; }} 
                    Book={this.props.navigation.getParam("_id",null)} 
                    categories={this.state.info ? this.state.info[0].categories : null}
                />
            </View>
               
        )
    }
}

const styles = StyleSheet.create({

    content:{
        flex: 1,
        padding: 10,
    },
    Thumbnail:{
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
const mapStateToProps = state => {
    return {
        selectHeaderVisible: state.Downloader.selectHeaderVisible,
    };
};
const mapDispatchToProps = {
    toggleSelectHeader,
    clearChapters,
};
export default connect(mapStateToProps, mapDispatchToProps)(Detail);