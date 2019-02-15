import React, { Component } from 'react';
import { StyleSheet,Dimensions,View,Text,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import RF from "react-native-responsive-fontsize"
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
/**
 * Modal sloužící k zobrazení postupu synchronizace.
 */
class SyncProgressModal extends Component {
    state = {
        modalVisible: false,
        syncing: false,
        SyncError : null,
        syncProgress : 0,
        SyncMSG : "Syncing...",
        Downloads : null,
        downloadProgress : 0.01,
    }
    /**
     * Zobrazí modal, nastaví state prop modaVisible na true.
     */
    showModal(){
        this.setState({ modalVisible: true});
    }
    /**
     * Skryje nebo zobrazí modal.
     */
    toggleModal(){
        let modalVisible = this.state.modalVisible
        this.setState({ modalVisible: !modalVisible});
    }
    /**
     * Kontroluje zda-li probíhá synchronizace, pokud ne schová Modal.
     * Nastavuje Redux state props na state props
     * Vypočítává postup procentuální postup stahování.
     */
    componentWillReceiveProps(NextProps){
        if(NextProps.Syncing && !this.state.syncing){
            this.toggleModal();
        }
        if(NextProps.downloads){
            let index = NextProps.downloads[0].pageStatus.findIndex(el => el.status===0);
            let progress = Math.round((index/NextProps.downloads[0].pageStatus.length) * 100) / 4;
            this.setState({
                downloadProgress : progress,
            })
            
        }
        this.setState({
            syncing : NextProps.Syncing,
            SyncError : NextProps.SyncError,
            syncProgress : NextProps.syncProgress,
            SyncMSG : NextProps.SyncMSG,
            Downloads : NextProps.downloads,
            
        })
    }
    render() {
        let progress =(this.state.syncProgress + this.state.downloadProgress)/100
        return (
        <Modal
            animationIn="zoomIn"
            animationOut="zoomOut"
            isVisible={this.state.modalVisible}
            //onBackdropPress={() => this.setState({ modalVisible: false })}
            useNativeDriver={true}
        >
            <View style={styles.container}>
                <Text style={[styles.textHeader,{padding:5,paddingBottom:10}]}>{this.state.SyncMSG}</Text>
                <View style={{flexDirection : "row",flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}}>
                    <Progress.Bar
                        height={12}
                        width={Math.round(Dimensions.get("screen").width*0.75) - 20}
                        
                        progress={progress > 100 ? 100 : progress}
                        useNativeDriver={true}
                    />
                </View>
                {this.state.SyncMSG === "Syncing Complete!" ? <View style={{alignItems: "flex-end",padding:3, paddingTop: 0}}>
                    <TouchableOpacity onPress={() => this.toggleModal()}>
                        <Text style={styles.textHeader}>OK</Text>
                    </TouchableOpacity>
                </View> : null}
                
            </View>
        </Modal>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        borderRadius:8,
        backgroundColor: "#fff",
        height: 150, 
        width:Math.round(Dimensions.get("screen").width*0.85),
        alignSelf:"center",
        padding: 10,
        paddingBottom: 0,
    },
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        padding: 8,
        paddingBottom: 5,
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});
const mapStateToProps = state => {
    return {
        Syncing : state.UserReducer.syncing,
        SyncError : state.UserReducer.SyncError,
        syncProgress : state.UserReducer.syncProgress,
        SyncMSG : state.UserReducer.SyncMSG,
        Downloads : state.Downloader.downloads,
    };
};
const mapDispatchToProps = {
   
};
export default connect(mapStateToProps, mapDispatchToProps)(SyncProgressModal);