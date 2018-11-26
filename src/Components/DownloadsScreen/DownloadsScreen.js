
import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text,Button,Dimensions} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { DrawerActions } from 'react-navigation';
import ButtonIcon from '../Icon/Icon';
import DowloadItem from './DownloadItem/DowloadItem';
import RNBackgroundDownloader from 'react-native-background-downloader';
export default class DownloadsScreen extends Component {
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
    async getDownloads(){
        let Downloads = this.state.Downloads;
        let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
        for(let task of lostTasks) {
            //console.log(`Task ${task.id} was found!`);
            let ID = task.id.split("//");
            ID[0] = ID[0] + "-" + ID[1];
            ID[1] = ID.pop();
            if(Downloads.length > 0){
                if(Downloads.find(obj => obj.id == ID[0])){
                    Downloads.find(obj => obj.id == ID[0]).files.push({id: ID[1],status: 0});
                }else{
                    Downloads.push({id: ID[0],files:[{id: ID[1],status: 0}]});
                }
            }else{
                Downloads.push({id: ID[0],files:[{id: ID[1],status: 0}]});
            }
            this.setState({Downloads : Downloads});
            task.progress((percent) => {
                //console.log(`Downloaded: ${percent * 100}%`);
            }).done(() => {
                //console.log("done",task.id);
                let newDowloads = this.state.Downloads;         
                newDowloads.find(obj => obj.id == ID[0]).files.find(obj => obj.id == ID[1]).status = 1;
                this.setState({Downloads : newDowloads});
            }).error((error) => {
                //console.log('Download canceled due to error: ', error);
            });
        }
        
    }  
    componentWillMount(){
        this.getDownloads();
    } 
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.Downloads ? this.state.Downloads.map((item,index) => (
                <DowloadItem 
                    title={item.id} 
                    chapterName={item.id} 
                    maxValue={item.files ? item.files.length : 0} 
                    value={item.files ? item.files.filter(el => {return el.status === 1 ?  el : null}).length : 0} key={index + item.id}/>
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