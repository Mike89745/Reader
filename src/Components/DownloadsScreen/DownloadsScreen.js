
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text,Button,Dimensions,View} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux'
import ButtonIcon from '../Icon/Icon';
import DowloadItem from './DownloadItem/DowloadItem';
import PopUpMenu from "../PopUpMenu/PopUpMenu"
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
        isPaused: true,
    }
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
            },
            headerMode: 'float',
            headerLeft: (
                <ButtonIcon
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    name="menu"
                    Color="#ffffff"
                />
            ),
            headerRight :(
                <View style={{flexDirection : "row",flex: 1,
                justifyContent: 'center',
                alignItems: 'center',marginRight:15}}>
                   <ButtonIcon
                        onPress={() => params ? params.toggleDownloads() : null}
                        name="play"
                        Color="#ffffff"
                    />
                    <PopUpMenu Color="#ffffff" name="dots-vertical" options={ params ? params.options : null}/>
                </View>
            ),
        };
      };

    componentDidMount(){
        //this.props.clearDownloads();
        this.props.navigation.setParams({options: [{text: "Clear queue",onSelect:this.props.clearDownloads}]});
        this.props.navigation.setParams({toggleDownloads: this.props.toggleDownloads});
        //this.props.navigation.setParams({isPaused: this.state.isPaused});
        this.props.loadData();
    }
    componentWillReceiveProps(nextProps) {
        //this.props.navigation.setParams({isPaused: nextProps.isPaused ? true : false});
        this.setState({ Downloads: nextProps.Downloads,task:nextProps.task,isPaused : nextProps.isPaused});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }


    render() {
        //<Button title="test" onPress={() => this.test()}/>
       // console.log(this.state.Downloads);
        return (
            <ScrollView style={styles.container}>
                <Button title={this.state.isPaused ? "Resume" : "Pause"} onPress={() => this.props.toggleDownloads()}/>
                {this.state.Downloads ? this.state.Downloads.map((item,index) => (
                <DowloadItem 
                    title={item.title ? item.title : "undefined"} 
                    chapterName={item.chapter ? item.chapter : "undefined"} 
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