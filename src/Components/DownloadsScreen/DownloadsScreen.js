
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text,Button,Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerActions } from 'react-navigation';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonIcon from '../Icon/Icon';
import DowloadItem from './DownloadItem/DowloadItem';
import {
    loadData,
    saveData,
    clearDownloads,
    nextDownload,
    toggleDownloads,
  } from '../../reducers/downloader/downloaderActions'
class DownloadsScreen extends Component {
    state={
        Downloads : [],
    }
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#fff"
                />
            )
        };
      };

    componentDidMount(){
        this.props.loadData();
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ Downloads: nextProps.Downloads,task:nextProps.task,isPaused : nextProps.isPaused});  
    }
    clearDownloads(){
        this.props.clearDownloads();
    }

    render() {
        //<Button title="test" onPress={() => this.test()}/>

        return (
            <ScrollView style={styles.container}>
            <Button title="Start" onPress={() => this.props.nextDownload()}/>
            <Button title="Clear" onPress={() => this.clearDownloads()}/>
            <Button title={this.state.isPaused ? "Resume" : "Pause"} onPress={() => this.props.toggleDownloads()}/>
                {this.state.Downloads ? this.state.Downloads.map((item,index) => (
                <DowloadItem 
                    title={item.title} 
                    chapterName={item.chapter} 
                    maxValue={item.pageStatus ? item.pageStatus.length : 3} 
                    value={item.pageStatus ? item.pageStatus.filter(el => {return el.status === 1 ?  el : null}).length : 0} 
                    key={index + item.title}/>
                )) : null}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});
const mapStateToProps = state => {
    return {
        Downloads: state.downloads.downloads,
        isFetching: state.downloads.isFetching,
        res: state.downloads.res,
        task : state.downloads.task,
        isPaused : state.downloads.isPaused,
    };
};
const mapDispatchToProps = {
    loadData,
    saveData,
    clearDownloads,
    nextDownload,
    toggleDownloads
};
export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);