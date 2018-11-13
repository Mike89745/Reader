import React, { Component } from 'react';
import { StyleSheet, View,TouchableWithoutFeedback,Text,Dimensions,Button,FlatList} from 'react-native';
import ReaderImage from "./ReaderImage/ReaderImage"
import RNFetchBlob from 'rn-fetch-blob';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from "react-native-fs"
import axios from 'react-native-axios';
import ReaderNav from './ReaderNav/ReaderNav';
const defHeight = Dimensions.get('window').height/2;
export default class Reader extends Component {
    state = {
        uri: null,
        currentPage: 1,
        currentImages : null,
        prevImages : null,
        Images : null,
        ImagesHeight: null,
        fromWeb: false,
        title: null,
        chapterName: null,
        chapter: 0,
        pages: null,
        isPrevChapter:false,

    }
    _viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    }
    openFileSelector () {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,res) => {
            // Android
            RNFS.stat(res.uri).then(
                (stat)=>{
                    let path = stat.originalFilepath;
                    path = path.substring(0, path.lastIndexOf("/"));
                    path = path.substring(0, path.lastIndexOf("/"));
                    this.loadChapter(path + "/" + this.state.chapter);
                }).catch((err) => {
                    console.log(err.message, err.code);
                });
            /*console.log(
               res.uri,
               res.type, // mime type
               res.fileName,
               res.fileSize
            );*/
            
           
          });
    }
    getChapterImages(){
        axios.request("https://mangareader-5f322.firebaseio.com/Thumbnails.json").then(Response => {
            let NewItems = Object.keys(Response.data).map(key => {return Response.data[key] ? Response.data[key] : null});
            let temp = [];
            for(let i of NewItems){
                i && temp.push({path: i.Link});
            }
            let CurrentState = this.state.result;
            if(CurrentState != null){
                CurrentState = [...CurrentState,...temp,...temp,...temp,...temp,...temp];
                this.setState({
                    currentImages : CurrentState,currentPage:1,
                    fromWeb:true,
                    pages:CurrentState.length,
                });
            }else{
                CurrentState = [...temp,...temp,...temp,...temp,...temp];
                this.setState({
                    currentImages : [...temp,...temp,...temp,...temp,...temp],
                    currentPage:1,
                    fromWeb:true,
                    pages:CurrentState.length,
                });
            }
        })
        .catch(error => console.log(error));
    
    }
    scrollToPage = (page,animated = true) =>{
        let x = 0;
        const images = this.state.Images
        if(!this.state.isPrevChapter) page += this.state.prevImages ? this.state.prevImages.length : 0;
        for (i = 0; i < page; i++) {
            if(images[i].height){
                x += images[i].height;
            }else{
                x += defHeight;
            }
        }
        this.ScrollRef.scrollToOffset({
            offset: x,
            animated: animated
         })

    }
    scrollToEnd=(animated = true)=>{
        let x = 0;
        let images = this.state.isPrevChapter ? this.state.Images : this.state.prevImages;
        if(!images) images = this.state.Images
        for (i = 0; i < images.length-1; i++) { 
            x += images[i].height;
        }
        this.ScrollRef.scrollToOffset({
            offset: x,
            animated: animated
         })
    }
    scrollToStart=(animated = true)=>{
        this.ScrollRef.scrollToOffset({
            offset: 0,
            animated: animated
         })
    }
    nextChapter = () =>{
       
        let chapter = this.state.chapter + 1;
        let pageToScroll = this.state.currentImages ? this.state.currentImages.length - 1 : 0; 
        RNFS.exists(this.state.uri + "/" + chapter).then((result) => {
            if(result === true){
                this.setState({chapter: chapter});
                this.loadChapter(this.state.uri + "/" + chapter,true);
            }
        });
    }
    prevChapter = () =>{

        let chapter = 0;
        let pageToScroll = this.state.prevImages ? this.state.prevImages.length - 1 : 0;
        if(chapter >= 0 && !this.state.isPrevChapter){
            RNFS.exists(this.state.uri + "/" + chapter).then((result) => {
                if(result === true){
                    this.setState({chapter: chapter});
                    this.loadChapter(this.state.uri + "/" + chapter,false);
                }
            });
           

        }
    }

    loadChapter(path,next){
        RNFS.readDir(path).then((result) => {
            result.sort(function(a, b){
                if(a.path < b.path) { return -1; }
                if(a.path > b.path) { return 1; }
                return 0;
            })
            const Height = Dimensions.get('window').height/2;
            result.forEach((element) => { 
                element.key = element.path;
                element.height = Height;
            });  
            console.log(result.length,"check");
            let newData =  Array.from(result);
            let currentData = null;

            if(this.state.currentImages){
                currentData = this.state.currentImages;
                currentData.forEach((element) => { element.key = element.path; });
                if(next){
                    newData.unshift(...currentData);
                    this.state.prevImages ? this.scrollToPage(currentData.length-1,false) : this.scrollToPage(currentData.length,false);
                    console.log(currentData.length,"NEXT");
                }else{
                    newData.push(...this.state.prevImages);
                    this.state.prevImages ? this.scrollToPage(result.length-1,false) : this.scrollToPage(result.length,false);
                    console.log(result.length,"PREV");
                }
            }
            console.log(currentData)
            this.setState({
                Images: newData,
                prevImages: currentData,
                currentImages: result,
                currentPage:1,
                fromWeb:false,
                pages:result.length,
                uri:path.substring(0, path.lastIndexOf("/"))
            });

            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
    }
    startReached(e){
        if(e.nativeEvent.contentOffset.y == 0){
            this.prevChapter();
        }
    }
    onViewableItemsChanged = ({ viewableItems, changed }) => {
        if(viewableItems.length > 0){
            let index = viewableItems.length - 1;
            if(index < 0){
                index = 0;
            }
            if(this.state.prevImages){
                if(viewableItems[index].index + 1 > this.state.prevImages.length){
                    viewableItems[index].index -= this.state.prevImages.length - 1;
                    this.setState({isPrevChapter: true,pages:this.state.currentImages.length});
                }else{
                    viewableItems[index].index += 1;
                    this.setState({isPrevChapter: false,pages:this.state.prevImages.length});
                } 
            }else{
                viewableItems[index].index += 1;
            }
            this.setState({currentPage: viewableItems[index].index});
        }
        
    }
    xd(){
        console.log(this.state.Images);
    }
    setHeight=(height,index)=>{
        let images = this.state.Images;
        if(height){
            images[index].height = height;
        }else{
            images[index].height = defHeight;
        }
        this.setState({images : images});
    }
    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                        <FlatList 
                            scrollEventThrottle={16}
                            extraData={this.state.Images}
                            onViewableItemsChanged={this.onViewableItemsChanged }
                            viewabilityConfig={this._viewabilityConfig}
                            ref={(ref) => { this.ScrollRef = ref; }}
                            data={this.state.Images}
                            onEndReached={() => this.nextChapter()}
                            onEndReachedThreshold={0.001}
                            initialNumToRender={this.state.Images ? this.state.Images.length : 21}
                            maxToRenderPerBatch={1}
                            windowSize={this.state.Images ? this.state.Images.length : 21}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            onScrollEndDrag={(e) => this.startReached(e)}
                            renderItem={({item,index}) =>
                                <ReaderImage 
                                    fromWeb={this.state.fromWeb} 
                                    source={item.path} 
                                    imageIndex={index}
                                    setHeight = {this.setHeight}
                                />
                            }
                        />
                </View>
                <ReaderNav 
                    nav={this.props.navigation} 
                    pages={this.state.pages ? this.state.pages : 1} 
                    setPage={this.scrollToPage}
                    nextChapter={this.nextChapter}
                    prevChapter={this.prevChapter}
                    currentPage={this.state.currentPage}
                />
                <View style={{flex:1,position: 'absolute', top: 50}}>
                    <Button title="Open" onPress={() => this.openFileSelector()}/>
                    <Button title="test" onPress={() => this.xd()}/>
                </View>
            </View>
        )
    }
}
//<Button title="test" onPress={() => this.xd()} styles={{ position: 'absolute', top: 50}}/>
const styles = StyleSheet.create({
    PageCounterContainer:{
        width: '100%', 
        backgroundColor: 'rgba(0, 0, 0, 0)',
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    PageCounter:{
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset:{width: 5, height: 5},
        textShadowRadius:10,
    },
    container :{
        flex:1,
        backgroundColor: "black"
    }
});