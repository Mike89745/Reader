import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,Image,Text} from 'react-native';
import PhotoView from 'react-native-photo-view';
import { Viewport } from '@skele/components'
import GiftedSpinner from '../../../../node_modules/react-native-gifted-spinner';
const ViewportAwareView = Viewport.Aware(View)
export default class ReaderImage extends Component {
    state = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
        inView: false,
    }
   
    calcImageSize(inView){
        let isInView = inView ? inView : this.state.inView;
        if(isInView){
            Image.getSize(this.props.fromWeb ? this.props.source : "file://" + this.props.source, (width, height) => {
                const maxWidth = Dimensions.get('window').width;
                const ratio = maxWidth / width;
                this.setState({ width: Math.floor(width * ratio), height: Math.floor(height * ratio)});
                this.props.setHeight(Math.floor(height * ratio),this.props.imageIndex);
            },(err)=>{console.log(err)});
        }
       
       
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.width != this.state.width || nextState.height != this.state.height) console.log(this.props.imageIndex," - ");
        return nextState.width != this.state.width || nextState.height != this.state.height ;
    }
    onViewportChange(){
        let inView = this.state.inView;
        this.setState({inView : !inView});
        this.calcImageSize(!inView);
    }
    componentDidMount() {
        //console.log(this.props.source);
    }
    componentWillUnmount(){
      //  console.log(this.props.imageIndex,"unmounted");
    }
    render() {
        
        
        return (
            <ViewportAwareView styles={styles.container} 
            onViewportEnter={() => this.onViewportChange()}
            onViewportLeave={() => this.onViewportChange()}>
                <View style={{width: this.state.width, height:this.state.height,flex: 1,backgroundColor: "black"}} onLayout={() => this.calcImageSize()}>
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
            </ViewportAwareView>
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