
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
    clearDownloads,
  } from '../../reducers/downloader/downloaderActions'
import ToggleDownloadButton from './ToggleDownloadButton/ToggleDownloadButton';
/**
 * Obrazovka, která zobrazuje současně stahované kapitoly a postup stahování.
 */
class DownloadsScreen extends Component {
    state={
        Downloads : [],
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
                    <ToggleDownloadButton/>
                    <PopUpMenu Color="#ffffff" name="dots-vertical" options={ params ? params.options : null}/>
                </View>
            ),
        };
      };
    /**
     * Načte Downloads pomocí redux metody loadData, a nastaví redux metodu na navigační parametr.
     */
    componentWillMount(){
        this.props.navigation.setParams({options: [{text: "Clear queue",onSelect:this.props.clearDownloads}]});
        this.props.loadData();
    }
    /**
     * Při změně v stahování změní state Downloads
     */
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.Downloads);
        this.setState({ Downloads: nextProps.Downloads ?  nextProps.Downloads : []});  
    }

    render() {

        return (
            <ScrollView style={styles.container}>
                {this.state.Downloads ? this.state.Downloads.map((item,index) => (
                <DowloadItem 
                    title={item.title ? item.title : " "} 
                    chapterName={item.chapter ? item.chapter : " "} 
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
        Downloads: state.Downloader.downloads,
    };
};
const mapDispatchToProps = {
    loadData,
    clearDownloads,
};
export default connect(mapStateToProps, mapDispatchToProps)(DownloadsScreen);