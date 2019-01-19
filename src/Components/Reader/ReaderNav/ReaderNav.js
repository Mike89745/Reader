
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,StatusBar} from 'react-native';
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
        StatusBar.setHidden(!shown);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ pages: nextProps.pages,currentPage: nextProps.currentPage,title : nextProps.title,chapter : nextProps.chapter });  
    }
    componentWillMount(){
        StatusBar.setHidden(true);
    }
    componentWillUnmount(){
        StatusBar.setHidden(false);
    }
    render() {
        return (
            <View style={styles.container}>
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
      
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
   
  
});
