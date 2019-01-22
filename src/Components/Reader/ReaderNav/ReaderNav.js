
import React, { Component } from 'react';
import { StyleSheet, View, Animated,StatusBar} from 'react-native';
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
        opacity: new Animated.Value(0)
    }
    ToggleNav =()=>{
        let shown =this.state.shown;
        this.setState({shown : !shown});
        StatusBar.setHidden(shown);
        if(shown){
            Animated.timing(this.state.opacity, { toValue: 0,duration:300,useNativeDriver:true }).start();
        }else{
            Animated.timing(this.state.opacity, { toValue: 1,duration:300,useNativeDriver:true }).start();
        }
        
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
            <Animated.View style={[styles.container,{opacity:this.state.opacity}]}>
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
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 5,
        zIndex : 100,
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
   
  
});
