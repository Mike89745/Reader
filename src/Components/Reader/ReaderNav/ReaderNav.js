
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,} from 'react-native';
import TopNav from './TopNav/TopNav';
import BottomNav from './BottomNav/BottomNav';


export default class ReaderNav extends Component {

    state={
        pages: null,
        currentPage: null
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ pages: nextProps.pages,currentPage: nextProps.currentPage });  
    }
    render() {
        return (
            <View style={styles.container}>
                <TopNav nav={this.props.nav} showSettings={this.props.showSettings}/>
                <BottomNav 
                    
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
