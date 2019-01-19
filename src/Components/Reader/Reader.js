import React, { Component } from 'react';
import { StyleSheet, View,TouchableWithoutFeedback,Text,Dimensions,Button,FlatList} from 'react-native';
import ReaderImage from "./ReaderImage/ReaderImage"
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from "react-native-fs"
import ReaderNav from './ReaderNav/ReaderNav';
import ReaderSettingsModal from './ReaderSettingsModal/ReaderSettingsModal';
import { Viewport } from '@skele/components'
import ReaderPDF from './ReaderPDFView/ReaderPDF';
import { connect } from 'react-redux'
import {
    loadSettings,
} from '../../reducers/Settings/SettingsActions'
import {
    saveChapter,
    saveChapters
} from '../../reducers/Chapters/Chapters'
import { ENDPOINT } from '../../Values/Values';
const defHeight = Dimensions.get('window').height/2;
class Reader extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        };
      };
    state = {
        uri: null,

        Images : null,
        fromWeb: false, 

        lastScrollHeight: null,

        Chapters : null,
        index : null,
        currentPage: 1,
        scrolled : false,
        horizontal:false,
        horizontalInv: false,
        settingsVisible : false,
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
                    this.loadChapter(path + "/" + this.state.Chapters[this.state.index].number,false);
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
    scrollToPage = (page,animated = true) =>{
        if(this.state.Chapters[this.state.index].type === "IMAGE"){
            let x = 0;
            const images = this.state.Images
            for (i = 0; i < page; i++) {
                if(!this.state.horizontal){
                    if(images[i].height){
                        x += images[i].height;
                    }else{
                        x += defHeight;
                    }
                }
                else{
                    x += Dimensions.get("screen").width;
                }
            }
            this.ScrollRef.scrollToOffset({
                offset: x,
                animated: animated
            })
        }
        else if(this.state.Chapters[this.state.index].type === "PDF"){
           /* let height = Dimensions.get("screen").height
            this.ScrollRef.scrollToPage({
                x: height * page,
                y: 0,
                animated:true,
            })*/
        }
    }
    scrollToEnd=(animated = true)=>{
        if(this.state.Chapters[this.state.index].type === "IMAGE"){
            let x = 0;
            let images = this.state.isPrevChapter ? this.state.Images : this.state.prevImages;
            if(!images) images = this.state.Images
            for (i = 0; i < images.length-1; i++) { 
                if(!this.state.horizontal){
                    if(images[i].height){
                        x += images[i].height;
                    }else{
                        x += defHeight;
                    }
                }
            else{
                x += Dimensions.get("screen").width;
            }
            }
            this.ScrollRef.scrollToOffset({
                offset: x,
                animated: animated
            })
        }
    }
    scrollToStart=(animated = true)=>{
        if(this.state.Chapters[this.state.index].type === "IMAGE"){
            this.ScrollRef.scrollToOffset({
                offset: 0,
                animated: animated
            });
        }
    }
    prevChapter = () =>{
        let index = this.state.index + 1;
        if(index >= 0 && !this.state.isPrevChapter && index < this.state.Chapters.length){
            const chapter = this.state.Chapters[index];
            chapter.lastRead = + new Date();
            chapter.MarkedAsRead = true;
            this.saveChapter(chapter);
            this.scrollToStart(false);
            this.setState({index : index},()=>this.loadChapter());
        }
    }
    nextChapter = () =>{
        let index = this.state.index - 1;
        if(index >= 0 && !this.state.isPrevChapter && index < this.state.Chapters.length){
            const chapter = this.state.Chapters[index];
            chapter.lastRead = + new Date();
            chapter.MarkedAsRead = true;
            this.saveChapter(chapter);
            this.scrollToStart(false);
            this.setState({index : index},()=>this.loadChapter());
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({Chapters :  nextProps.Chapters})
    }
    componentWillMount(){
        this.props.loadSettings();
        this.ChangeSettings(this.props.settings.ReaderLayout)
        this.setState({
            uri :  this.props.navigation.getParam("uri",null) ,
            fromWeb : this.props.navigation.getParam("downloaded",null),
            index : this.props.navigation.getParam("index",null),
            Chapters : this.props.Chapters,
        });
    }
    componentDidMount(){
        this.loadChapter();
    }
    loadChapter(chapter){
        let title = chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapter = (chapter.number +"-"+chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
            if(response) RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${title}/${chapter}`).then(response => {
               chapter.pages === response.length ? this.loadChapterFromStorage() : this.loadChapterFromWeb();
            })
        }).catch(err => {console.log(err)});
    }
    loadChapterFromWeb(){
        const chapter = this.state.Chapters[this.state.index];
        if(chapter.type === "IMAGE"){
            let images = [];
            for (let index = 1; index < chapter.pages; index++) {
                images.push({path : 
                    ENDPOINT 
                    + "public/books/"
                    + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                    + chapter.number + "-" 
                    + chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" 
                    + index
                });
            }
            const Height = Dimensions.get('window').height/2;
            images.forEach((element) => { 
                element.key = element.path;
                element.height = Height;
            });  
            this.setState({
                Images: images,
                currentPage:1,
            });
        }
        else if(chapter.type === "PDF"){
            this.setState({
                uri:ENDPOINT 
                + "public/books/"
                + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                + chapter.number + "-" 
                + chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" 
                + index + ".pdf"
            })
        }else if(chapter.type === "EPUB"){
            this.setState({
                uri:ENDPOINT 
                + "public/books/"
                + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                + chapter.number + "-" 
                + chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" 
                + index + ".epub"
            })
        }
    }
    loadChapterFromStorage(){
        const chapter = this.state.Chapters[this.state.index];
        RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-')}/${chapter.number}-${chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-')}`).then((result) => {
            if(chapter.type === "IMAGE"){
                result.sort((a, b) => parseInt(a.name.replace(/\.[^/.]+$/, "")) - parseInt(b.name.replace(/\.[^/.]+$/, "")));
                const Height = Dimensions.get('window').height/2;
                result.forEach((element) => {
                    element.key = element.path;
                    element.height = Height;
                });  
                this.setState({
                    Images: result,
                    currentPage:1,
                    fromWeb:false,
                });
            }
            if(chapter.type === "PDF"){
                this.setState({
                    fromWeb:false,
                    uri:result[0].path
                })
            }

            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
    }
    
    startReached(e){
        let lastScrollHeight = this.state.lastScrollHeight
        let offset = this.state.horizontal ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y;
        if(offset == 0){
            this.state.horizontalInv ? this.nextChapter() : this.prevChapter();
        }
        else if(lastScrollHeight == offset){
            this.state.horizontalInv ? this.prevChapter() : this.nextChapter();
        }
        this.setState({lastScrollHeight: offset})

    }
    onViewableItemsChanged = ({ viewableItems, changed }) => {
        if(viewableItems.length > 0){
            let index = viewableItems.length - 1;
            if(index < 0){
                index = 0;
            }
            this.setState({currentPage: viewableItems[index].index + 1});
        }
        
    }
    setCurrentPage =(page)=>{
        this.setState({currentPage: page});
    }
    setPages = (pages) =>{
        let chapter = this.state.Chapters[this.state.index];
        chapter.pages = pages;
        this.setState({chapter: chapter});
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
    showSettings=()=>{
        this.SettingsModal.toggleModal();
    }
    ChangeSettings=(setting)=>{
        switch(setting) {
            case "H":
                this.setState({horizontal:true,horizontalInv:false});
                break;
            case "Hrtl":
                this.setState({horizontal:true,horizontalInv:true});
                break;
            default:
                this.setState({horizontal:false,horizontalInv:false});
        }
    }
    saveChapter(chapter){
        this.props.saveChapter(chapter);
    }
    componentWillUnmount(){
        const chapter = this.state.Chapters[this.state.index];
        chapter.lastPage = this.state.currentPage;
        chapter.lastRead = + new Date();
        this.saveChapter(chapter);
    }
    shouldComponentUpdate(nextProps,nextState){
        if(this.state.Chapters && this.state.index && this.state.Images){
            const chapter = this.state.Chapters[this.state.index];
            if (!this.state.scrolled && this.state.currentPage >= chapter.lastPage) {
                this.setState({scrolled: true});
            } else  if (chapter.lastPage > 1 && !this.state.scrolled) {
                this.scrollToPage(chapter.lastPage, true);
            }
        }
       
        return true;
    }
    render() {
        return (
            <View style={{flex:1}}>
            {this.state.Chapters ? 
            this.state.Chapters[this.state.index].type ==="IMAGE" ?(
                <Viewport.Tracker style={styles.container} preTriggerRatio={0.5}>
                    <FlatList 
                        scrollEventThrottle={16}
                        horizontal = {this.state.horizontal}
                        onViewableItemsChanged={this.onViewableItemsChanged }
                        viewabilityConfig={this._viewabilityConfig}
                        ref={(ref) => { this.ScrollRef = ref; }}
                        data={this.state.Images}
                        pagingEnabled= {this.state.horizontal}
                        inverted={this.state.horizontalInv}
                        initialNumToRender={this.state.Images ? this.state.Images.length : 21}
                        windowSize={this.state.Images ? this.state.Images.length : 21}
                        maxToRenderPerBatch={1}
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
                </Viewport.Tracker>)
            : null : null}
            { this.state.Chapters ? this.state.Chapters[this.state.index].type === "PDF" ?  
                <ReaderPDF 
                    setPages={this.setPages} 
                    setCurrentPage={this.setCurrentPage} 
                    source={{uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true}}
                    horizontal = {this.state.horizontal}
                    horizontalInv={this.state.horizontalInv}
                    spacing = {3}
                    ref={(ref) => { this.ScrollRef = ref; }}
                />
               
            : null : null}
             { this.state.Chapters ?this.state.Chapters[this.state.index].type ==="EPUB" ? <Text>Epub</Text> : null : null}
             {this.state.Chapters ?   
             <View>         
                <ReaderNav 
                    ref={(ref) => { this.Nav = ref; }}
                    nav={this.props.navigation} 
                    pages={this.state.Chapters[this.state.index].pages} 
                    setPage={this.scrollToPage}
                    nextChapter={this.nextChapter}
                    prevChapter={this.prevChapter}
                    currentPage={this.state.currentPage}
                    showSettings={this.showSettings}
                    title = {this.state.Chapters[this.state.index].book_id}
                    chapter = {this.state.Chapters[this.state.index].title}
                />
                <ReaderSettingsModal  ref={(ref) => { this.SettingsModal = ref; }} ChangeSettings={this.ChangeSettings}/> 
                </View>
                : null }
            </View>
        )
    }
}
/*<Button title="test" onPress={() => this.xd()} styles={{ position: 'absolute', top: 50}}<View style={{flex:1,position: 'absolute', top: 50}}>
                    <Button title="Open" onPress={() => this.openFileSelector()}/>
                    <Button title="test" onPress={() => this.xd()}/>
                </View>/>*/
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
const mapStateToProps = state => {
    return {
        Chapters : state.ChaptersReducer.Chapters,
        settings: state.Settings.Settings,
    };
};
const mapDispatchToProps = {
    loadSettings,
    saveChapter,
    saveChapters
};
export default connect(mapStateToProps, mapDispatchToProps)(Reader);