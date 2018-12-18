import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,Button,Text,ScrollView } from 'react-native';
import Info from "./Info/Info";
import ThumbNail from "./ThumbNail/ThumbNail";
import Description from "./Description/Description";
import TagList from "./TagList/TagList";
import Tabs from "./Tabs/Tabs";
import Spinner from 'react-native-gifted-spinner';
import ButtonIcon from '../Icon/Icon';
import PouchDB from 'pouchdb-react-native';
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
PouchDB.plugin(find)
const Library = new PouchDB('Library');
const ChaptersDB = new PouchDB('Chapters');

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
            headerTitle: ( <Text style={{color: "#fff"}}> {params ? params.title : ''}</Text> ),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
        };
      };
    state ={
        info : null,
        inLibrary : false,
        infoLoading : false,
        size : 150,
        height : 0,
        chapters: null,
        added : false,
        Book: null,
        error: false,
    }
    getInfo = () => {
        
        Library.get(this.props.navigation.getParam("_id",null)).then((response) => {
            let data = [];
            data.push(response)
           
            ChaptersDB.createIndex({
                index: {
                    fields: ['book_id','number']
                }
            }).then(() => {
                return ChaptersDB.find({
                    selector: {
                        book_id : {$eq : this.props.navigation.getParam("_id",null)},
                    }
                }).then(response => {
                    SimpleToast.show(response.docs.length.toString(),SimpleToast.LONG);
                    if(response.docs.length > 0)  this.setState({chapters: response.docs});
                }).catch(err => {
                    SimpleToast.show("Error getting chapters",SimpleToast.LONG);
                    console.log(err)
                });
            }).catch(function (err) {
                SimpleToast.show("Error creating chapters indexes",SimpleToast.LONG);
                console.log(err);
            });
            //console.log(data);
            this.setState({info : data, infoLoading : false,inLibrary:true,added:true});
            this.props.navigation.setParams({title: data[0]._id});
        }).catch((error) => {
            if(error.status == 404){
                this.setState({infoLoading : true});
                fetch('https://mike.xn--mp8hal61bd.ws/getBook/' + this.props.navigation.getParam("_id",null)).then(response =>{
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
        this.props.clearChapters()
        //this.props.toggleSelectHeader();
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
        Library.get(this.state.info[0]._id).then((response) => {
            Library.remove(response).then(response =>{
                this.setState({added : false});
            }).catch((err) => {
                SimpleToast.show("Error removing from library, this shouldnt happen",SimpleToast.LONG);
                console.log(err,"delete");
            });
        }).catch((error) => {
            if(error.status == 404){
                const book ={
                    _id :this.state.info[0]._id, 
                    author :  this.state.info[0].author,
                    artist :  this.state.info[0].artist,
                    rating : this.state.info[0].rating,
                    status : this.state.info[0].status,
                    description : this.state.info[0].description,
                    tags: this.state.info[0].tags,
                    categories: [],
                    lastRead: null,
                }
                Library.put(book).then((response) => {
                    this.CategoriesModal.toggleModal();
                    this.saveThumbNail(book._id.replace(/[/\\?%*:|"<>. ]/g, '-')) 
                    this.setState({added : true,error:false});
                }).catch((err) => {
                    SimpleToast.show("Error saving book, this shouldnt happen",SimpleToast.LONG);
                });
            }
        });
    }
    saveThumbNail(bookID){
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/thumbnails/$`).then(response => {
            if(!response) { 
                RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/thumbnails/$`);
            }
        });
        let task = RNBackgroundDownloader.download({
            id: "//"+ bookID + "//Thumbnail",
            url: `https://mike.xn--mp8hal61bd.ws/public/thumbnails/${bookID}`,
            destination: `${RNFS.DocumentDirectoryPath}/thumbnails/${bookID}.jpg`
          }).begin((expectedBytes) => {
          }).progress((percent) => {
          }).done(() => {
          }).error((error) => {
              RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${bookID}.jpg`).then(response => {
                  if(!response) { 
                    SimpleToast.show("Error saving Thumbnail",SimpleToast.LONG);
                  }
              });
          });
    }
    getChapters=()=>{
        SimpleToast.show("getting chapters",SimpleToast.LONG);
        fetch('https://mike.xn--mp8hal61bd.ws/getChapters/' + this.state.info[0]._id).then(response =>{
            return response.json()
        }).then((response) => {
            let chapters = [];
            response.docs.map((chapter) =>{
                chapters.push({
                    book_id : chapter.book_id,
                    number : chapter.number,
                    title : chapter.title,
                    dateAdded : chapter.dateAdded,
                    read : false,
                    lastRead : null,
                })
            })
            if(chapters.length === 0){
                SimpleToast.show("No chapters.",SimpleToast.LONG);
            }else{
                ChaptersDB.bulkDocs(chapters).then((response) => {
                }).catch((err) => {
                    SimpleToast.show("Error saving chapters, this shouldnt happen",SimpleToast.LONG);
                    console.log(err,"chapters");
                });
            }  
            this.setState({chapters:chapters});
        }).catch(error =>{
            SimpleToast.show("Error getting chapters, please Try again",SimpleToast.LONG);
            this.setState({error:true})
            console.log(error);
        }); 
        
    }

    render() {
        return (
            <View> 
                <ScrollView>
                    {this.state.info ? 
                    <View> 
                        <View style={{flexDirection : "row",padding: 10, height : this.state.height, backgroundColor: "#Dee"}}>
                            <View style={{width : this.state.size,paddingRight: 10}}>
                                <ThumbNail 
                                source={this.state.added ? 
                                {uri : `${RNFS.DocumentDirectoryPath}/thumbnails/${this.state.info[0]._id.replace(/[/\\?%*:|"<>. ]/g, '-')}.jpg`} 
                                :
                                {uri: ("https://mike.xn--mp8hal61bd.ws/public/thumbnails/") + this.state.info[0]._id.replace(/[/\\?%*:|"<>. ]/g, '-')}}
                                />
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
                        {this.state.selectHeaderVisible ? <View>
                            <SelectHeader/>
                        </View> : null}
                        <Tabs bookID={this.state.info[0]._id} nav={this.props.navigation} getChapters={this.getChapters} chapters={this.state.chapters}/>
                        
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
const mapStateToProps = state => {
    return {
        selectHeaderVisible: state.Downloader.selectHeaderVisible,
    };
};
const mapDispatchToProps = {
    toggleSelectHeader,
    clearChapters
};
export default connect(mapStateToProps, mapDispatchToProps)(Detail);