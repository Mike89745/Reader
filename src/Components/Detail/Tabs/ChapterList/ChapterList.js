import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import Chapter from "./Chapter/Chapter"
import RNFS from "react-native-fs";
import { connect } from 'react-redux'
import {
    loadData,
    saveData,
    setchapterRefs,
    toggleSelectHeader,
  } from '../../../../reducers/downloader/downloaderActions'
class ChapterList extends Component {
   
    constructor(props) {
        super(props);
    
        this. state ={
            chapters: null,
            chapterRefs: [],
            Downloads: [],
            selectHeaderVisible : false
        }
      }

    onToggleSelect = () =>{
        this.state.selectHeaderVisible ? null: this.props.toggleSelectHeader()
    }
    addRef(ref,index){
        let refs = this.state.chapterRefs
        refs[index] = ref;
        refs.length === this.state.chapters.length ? this.props.setchapterRefs(refs) : null;
        this.setState({chapterRefs: refs});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ chapters: nextProps.screenProps.chapters,Downloads: nextProps.Downloads,selectHeaderVisible : nextProps.selectHeaderVisible});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.Downloads && nextState.Downloads){
            return nextState.chapters != this.state.chapters || nextState.Downloads.length != this.state.Downloads.length || nextState.selectHeaderVisible != this.state.selectHeaderVisible;
        }else{
            return nextState.chapters != this.state.chapters || nextState.selectHeaderVisible != this.state.selectHeaderVisible;
        }
    }
    componentDidMount(){
        
        this.props.loadData();
    }
    render() {
        return (
            <ScrollView style={styles.container} nestedScrollEnabled={true}>
                {this.state.chapters ? this.state.chapters.map((item,index) => 
                 <Chapter key={index} 
                    chapterName={item.title} 
                    chapterCount={item.number} 
                    dateAdded={item.dateAdded} 
                    bookID={this.props.screenProps.bookID}
                    nav = {this.props.screenProps.nav}
                    ref={(chapterRef) => this.addRef(chapterRef,index)}
                    onToggleSelect ={this.onToggleSelect}
                    index = {index}
                    queued = {false}
                    pages = {item.pages ? item.pages : 0}
                    selectHeaderVisible = {this.state.selectHeaderVisible}
                 />) 
                 : 
                 <Button title="Load Chapters" onPress={() => this.props.screenProps.getChapters()}/>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
   
});
const mapStateToProps = state => {
    return {
        Downloads: state.downloads.downloads,
        isFetching: state.downloads.isFetching,
        res: state.downloads.res,
        chapterRefs: state.downloads.chapterRefs,
        selectHeaderVisible: state.downloads.selectHeaderVisible,
    };
};
const mapDispatchToProps = {
    loadData,
    saveData,
    setchapterRefs,
    toggleSelectHeader,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChapterList);