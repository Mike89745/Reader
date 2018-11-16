import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,Image,Text} from 'react-native';
import PhotoView from 'react-native-photo-view';

import GiftedSpinner from '../../../../node_modules/react-native-gifted-spinner';

export default class ReaderImage extends Component {
    state = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
        canLoad: false,
    }
   
    calcImageSize(){
       
        Image.getSize(this.props.fromWeb ? this.props.source : "file://" + this.props.source, (width, height) => {
            
            const maxWidth = Dimensions.get('window').width;
            console.log(maxWidth,Dimensions.get('screen').width);
            const ratio = maxWidth / width;
            this.setState({ width: Math.floor(width * ratio), height: Math.floor(height * ratio)});
            this.props.setHeight(Math.floor(height * ratio),this.props.imageIndex);
        },(err)=>{console.log(err)});
       
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.width != this.state.width || nextState.height != this.state.height) console.log(this.props.imageIndex," - ");
        return nextState.width != this.state.width || nextState.height != this.state.height ;
    }
    componentDidMount() {
    }
    componentWillUnmount(){
        console.log(this.props.imageIndex,"unmounted");
    }
    render() {
        
        
        return (
            <View styles={styles.container} onLayout={() => this.calcImageSize()}>
                <View style={{width: this.state.width, height:this.state.height,flex: 1,backgroundColor: "black"}}>
                    <PhotoView
                        loadingIndicatorSource = {<GiftedSpinner styles={styles.Spinner}/>}
                        source={{uri: this.props.fromWeb ? this.props.source : "file://" + this.props.source}}
                        minimumZoomScale={1}
                        maximumZoomScale={3}
                        androidScaleType="fitCenter"
                        fadeDuration = {200}
                        resizeMethod ={'resize'}
                        style={{width: this.state.width, height:this.state.height,flex: 1}}
                        onError={(e) => console.log(e,this.props.imageIndex)}
                    />
                </View> 
            </View>
        )

    }
}
/*<PhotoView
loadingIndicatorSource = {<GiftedSpinner styles={styles.Spinner}/>}
source={{uri: this.props.fromWeb ? this.props.source : "file://" + this.props.source}}
minimumZoomScale={1}
maximumZoomScale={3}
androidScaleType="fitCenter"
fadeDuration = {200}
style={{width: this.state.width, height:this.state.height,flex: 1,backgroundColor: "red"}}
/>*/
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "black"
    },
    Spinner : {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: "black"
    } 
    
});