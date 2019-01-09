
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,} from 'react-native';
import TopNav from './TopNav/TopNav';
import BottomNav from './BottomNav/BottomNav';
import * as Animatable from 'react-native-animatable';
export default class ReaderNav extends Component {

    state={
        pages: null,
        currentPage: null,
        title : null,
        chapter : null,
        shown : false,
    }
    ToggleNav =()=>{
        let shown =this.state.shown;
        this.BottomNav.toggleNav(shown);
        this.setState({shown : !shown});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ pages: nextProps.pages,currentPage: nextProps.currentPage,title : nextProps.title,chapter : nextProps.chapter });  
    }
    
    render() {
        return (
            <View>
                <TopNav 
                    ref={(ref) => { this.TopNav = ref; }}
                    nav={this.props.nav} 
                    showSettings={this.props.showSettings} 
                    title={this.state.title} 
                    chapter={this.state.chapter}
                />
                <BottomNav 
                    ref={(ref) => { this.BottomNav = ref; }}
                    pages={this.state.pages} 
                    setPage={this.props.setPage} 
                    nextChapter={this.props.nextChapter}
                    prevChapter={this.props.prevChapter}
                    currentPage={this.state.currentPage}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: Dimensions.get("window").height,
    },
   
  
});
