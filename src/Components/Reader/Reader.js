import React, { Component } from 'react';
import { StyleSheet, View,StatusBar,Text,Dimensions,Button ,FlatList} from 'react-native';
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
    saveSettings,
} from '../../reducers/Settings/SettingsActions'
import {
    saveChapter,
    saveChapters
} from '../../reducers/Chapters/Chapters'
import { ENDPOINT } from '../../Values/Values';
import TopNav from './ReaderNav/TopNav/TopNav';
import BottomNav from './ReaderNav/BottomNav/BottomNav';
/**
 * Slouží ke čtení knih s navigací. Obstarava veškerou logiku čtečky.
 */
const defHeight = Dimensions.get('window').height/2; //Základní velikost obrázku
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
        shown : false,
    }
    _viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    }
   /* openFileSelector () {
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
            );
            
           
          });
    }*/
    /** 
     * Zkontroluje zda-li je kapitola komix, pokud ano tak se posune na pozici stránky. 
     * Pozice se vypočítá podle výšky každého obrázku až k stránce, která je uloženo v state prop Images.
     * @param {*} page Strana na kterou má posunout
     * @param {*} animated Zda-li má být posun animovaný, Default true
     */
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
        
    }
     /** 
     * Zkontroluje zda-li je kapitola komix, pokud ano sečte výšku všech obrázků a posune na vypočítanou která je uloženo v state prop Images.
     * @param {*} animated Zda-li má být posun animovaný, Default true
     */
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
    /** 
     * Zkontroluje zda-li je kapitola komix, pokud ano posune se na pozici 0.
     * @param {*} animated Zda-li má být posun animovaný, Default true
     */
    scrollToStart = (animated = true) => {
        if(this.state.Chapters[this.state.index].type === "IMAGE"){
            this.ScrollRef.scrollToOffset({
                offset: 0,
                animated: animated
            });
        }
    }
    /**
     * Zkontroluje zda-li předchozí kapitola existuje, pokud ano uloží aktuální kapitolu pomocí metody saveChapter, posune se na začátek metodou scrollToStart, 
     * nastaví state prop index na předchozí kapitolu a zavolá metodu loadChapter. 
     */
    prevChapter = () =>{
        let index = this.state.index + 1;
        if(index >= 0 && !this.state.isPrevChapter && index < this.state.Chapters.length){
            const chapter = this.state.Chapters[index - 1];
            chapter.lastRead = + new Date();
            chapter.lastPage = this.state.currentPage;
            this.saveChapter(chapter);
            this.scrollToStart(false);
            this.setState({index : index},()=>this.loadChapter());
        }       
    }
    /**
     * Zkontroluje zda-li další kapitola existuje, pokud ano uloží aktuální kapitolu pomocí metody saveChapter, posune se na začátek metodou scrollToStart , 
     * nastaví state prop index na další kapitolu a zavolá metodu loadChapter.
     */
    nextChapter = () =>{
        let index = this.state.index - 1;
        if(index >= 0 && !this.state.isPrevChapter && index < this.state.Chapters.length){
            const chapter = this.state.Chapters[index + 1];
            chapter.lastRead = + new Date();
            this.state.currentPage + 1 >= chapter.pages ? chapter.MarkedAsRead = true : chapter.lastPage = this.state.currentPage;
            this.saveChapter(chapter);
            this.scrollToStart(false);
            this.setState({index : index},()=>this.loadChapter());
        }
    }
    /**
     * Nastaví redux state props na state props.
     */
    componentWillReceiveProps(nextProps){
        this.setState({Chapters :  nextProps.Chapters})
    }
    /**
     * Nastaví state props index na danou kapitolu.
     */
    componentWillMount(){
        this.props.loadSettings();
        this.ChangeSettings(this.props.settings.ReaderLayout)
        this.setState({
            index : this.props.navigation.getParam("index",null),
            Chapters : this.props.Chapters,
        });
    }
    /**
     * Načte danou kapitolu pomocí metody loadChapter a skryje StatusBar.
     */
    componentDidMount(){    
        this.loadChapter();
        StatusBar.setHidden(true);
    }
    /**
     * 	Zkontroluje zda-li nová kapitola je stažená v zařízením, pokud ano zavolá metodu loadChapterFromStorage, pokud ne zavolá metodu loadChapterFromWeb.
     * @param {*} chapter Kaptila k načtení
     */
    loadChapter(chapter = this.state.Chapters[this.state.index]){
        let title = chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-');
        let chapterName = (chapter.number +"-"+chapter.title).replace(/[/\\?%*:|"<>. ]/g, '-');
        let type = chapter.type;
        RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapterName}`).then(response => {
            if(response){
                if(type === "IMAGE"){
                    RNFS.readDir(`${RNFS.DocumentDirectoryPath}/${title}/${chapterName}`).then(response => {
                        chapter.pages === response.length ? this.loadChapterFromStorage() : this.loadChapterFromWeb();
                    }).catch(err => this.loadChapterFromWeb());
                }else{
                    RNFS.exists(`${RNFS.DocumentDirectoryPath}/${title}/${chapterName}/${chapterName}.${type === "PDF" ? "pdf" : type ==="EPUB" ? "epub" : null}`).then(response => {
                        response ? this.loadChapterFromStorage() : this.loadChapterFromWeb();
                    }).catch(err => {
                        this.loadChapterFromWeb();
                    });
                }
               
            }else{
                this.loadChapterFromWeb()
            } 
        }).catch(err => {console.log(err)});
    }
    /**
     * Načte kapitolu z webu. 
     * 
     * Zkontroluje zda-li je kapitola komix, pokud ano podle počtu stránek vytvoří pole objektů images a 
     * nastaví jim atribut path na cestu k dané stránce a atribut height na základní hodnotu poloviční velikost displeje. Poté nastaví pole images na state props Images a 
     * state prop currentPage na 1. 
     * Zda-li je kapitola kniha, tak nastaví state prop uri na cestu ke knize.
     */
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
                fromWeb: true,
            });
        }
        else if(chapter.type === "PDF"){
         
            this.setState({
                uri:ENDPOINT 
                + "public/books/"
                + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                + chapter.number + "-" + chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" 
                + chapter.number + "-" +chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + ".pdf",
                fromWeb: true,
            })
            this.setCurrentPage(chapter.lastPage);
        }else if(chapter.type === "EPUB"){
        
            this.setState({
                uri:ENDPOINT 
                + "public/books/"
                + chapter.book_id.replace(/[/\\?%*:|"<>. ]/g, '-') +"/"
                + chapter.number + "-" 
                + chapter.title.replace(/[/\\?%*:|"<>. ]/g, '-') + "/" 
                + index + ".epub",
                fromWeb: true,
            })
        }
    }
    /**
     * Načte kapitolu ze zařízení. 
     * 
     * Přečte složku s kapitolou. Zda-li je kapitola komix, tak podle počtu stránek vytvoří pole objektů images a nastaví jim atribut path na 
     * cestu k dané stránce a atribut height na základní hodnotu poloviční velikost displeje. 
     * Poté nastaví pole images na state props Images a state prop currentPage na 1. 
     * Zda-li je kapitola kniha, tak nastaví state prop uri na cestu k knize. 
     */
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
                    uri: "file://" + result[0].path
                })
                this.setCurrentPage(chapter.lastPage);
            }

            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
    }
    /**
     * Zda-li je scroll na pozici 0 a poslední pozice je 0, tak načte předchozí kapitolu. Zda-li state prop horizontalInv je true, tak načte další kapitolu.
     */
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
    /**
     * Zavolána při posunu čtečky. Kontroluje zda-li je změnila stránka, pokud ano  nastaví currentPage na aktuální stránku.
     */
    onViewableItemsChanged = ({ viewableItems, changed }) => {
        if(viewableItems.length > 0){
            let index = viewableItems.length - 1;
            if(index < 0){
                index = 0;
            }
            this.setState({currentPage: viewableItems[index].index + 1});
        }
        
    }
    /**
     * Nastaví state prop currentPage na page.
     * @param {*} page Aktuální stránka
     */
    setCurrentPage =(page)=>{
        this.setState({currentPage: page});
    }
    /**
     * Nastvaví počet stran, pokud je kapitola PDF.
     * @param {*} pages Počet stránek
     */
    setPages = (pages) =>{
        let chapter = this.state.Chapters[this.state.index];
        chapter.pages = pages;
        this.setState({chapter: chapter});
    }
    /**
     * Nastvaví výšku obrázku na výšku načteného obrázku.
     * @param {*} height Výška obrázku
     * @param {*} index Pozice v poli state prop Images, číslo stránky
     */
    setHeight=(height,index)=>{
        let images = this.state.Images;
        if(height){
            images[index].height = height;
        }else{
            images[index].height = defHeight;
        }
      
        this.setState({images : images});
    }
    /**
     * Zobrazí modal s nastaveními čtečky.
     */
    showSettings=()=>{
        this.SettingsModal.toggleModal();
    }
    /**
     * Změní nastavení čtečky a uloží je do lokální databáze pomocí redux metody saveSettings.
     * @param {*} setting Nové nastavení čtečky
     */
    ChangeSettings=(setting)=>{
        this.props.saveSettings(setting,"ReaderLayout")
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
    /**
     * Uloží změny v kapitole do lokální databáze.
     * @param {*} chapter Aktuální kapitola
     */
    saveChapter(chapter){
        this.props.saveChapter(chapter);
    }
    /**
     * Uloží aktuální kapitolu pomocí metody saveChapter zobrazí StatusBar.
     */
    componentWillUnmount(){
        const chapter = this.state.Chapters[this.state.index];
        chapter.lastPage = this.state.currentPage;
        chapter.lastRead = + new Date();
        this.saveChapter(chapter);
        StatusBar.setHidden(false);
    }
    /**
     * Kontroluje zda-li se změnila kapitola.
     */
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
    /**
     * Zavolá metody z referencí na komponenty TopNav a BottomNav jejich metodu ToggleNav a skryje nebo zobrazí StatusBar.
     */
    ToggleNav =()=>{
        let shown =this.state.shown;
        this.setState({shown : !shown});
        StatusBar.setHidden(shown);
        this.BottomNav.ToggleNav(shown);
        this.TopNav.ToggleNav(shown);
    }
    render() {
        return (
            <View style={{flex:1}}>
            {this.state.Chapters ? 
            this.state.Chapters[this.state.index].type ==="IMAGE" ?(
                <Viewport.Tracker style={[styles.container]} preTriggerRatio={0.5}>
               
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
                        style={{zIndex:1,elevation:1}}
                        onScrollEndDrag={(e) => this.startReached(e)}
                        renderItem={({item,index}) =>
                       
                            <ReaderImage 
                                showNav = {this.ToggleNav}
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
                    showNav = {this.ToggleNav}
                    setPages={this.setPages} 
                    setCurrentPage={this.setCurrentPage} 
                    currentPage = {this.state.currentPage}
                    source={{uri:this.state.uri,cache:true}}
                    horizontal = {this.state.horizontal}
                    horizontalInv={this.state.horizontalInv}
                    spacing = {3}
                    ref={(ref) => { this.ScrollRef = ref; }}
                />
               
            : null : null}
             { this.state.Chapters ?this.state.Chapters[this.state.index].type ==="EPUB" ? <Text>Epub</Text> : null : null}
            {this.state.Chapters ?   
                <ReaderSettingsModal  ref={(ref) => { this.SettingsModal = ref; }} ChangeSettings={this.ChangeSettings}/> 
            : null }
            {this.state.Chapters ?
                <TopNav 
                    ref={(ref) => { this.TopNav = ref; }}
                    nav={this.props.navigation} 
                    showSettings={this.showSettings} 
                    title={this.state.Chapters[this.state.index].book_id} 
                    chapter={this.state.Chapters[this.state.index].title}
                />
            : null }
            {this.state.Chapters ?
                <BottomNav
                    ref={(ref) => { this.BottomNav = ref; }}
                    pages={this.state.Chapters[this.state.index].pages} 
                    setPage={ this.state.Chapters[this.state.index].type ==="PDF" ? this.setCurrentPage : this.scrollToPage} 
                    nextChapter={this.nextChapter}
                    prevChapter={this.prevChapter}
                    currentPage={this.state.currentPage}
                />
            : null }
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container :{
        flex:1,
        backgroundColor: "black"
    },
});


const mapStateToProps = state => {
    return {
        Chapters : state.ChaptersReducer.Chapters,
        settings: state.Settings.Settings,
    };
}; // Data z Redux na props
const mapDispatchToProps = {
    loadSettings,
    saveChapter,
    saveChapters,
    saveSettings
}; // Použitelné Redux metody na props
export default connect(mapStateToProps, mapDispatchToProps)(Reader); // (Reader) - Jmeno komponentu