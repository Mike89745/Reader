import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,Image,Button} from 'react-native';
import PhotoView from 'react-native-photo-view';
import { Viewport } from '@skele/components'
import GiftedSpinner from '../../../../node_modules/react-native-gifted-spinner';
const ViewportAwareView = Viewport.Aware(View)
export default class ReaderImage extends Component {
    state = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
        inView: false,
        error : false,
        Loading : true,
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
       // if(nextState.width != this.state.width || nextState.height != this.state.height) console.log(this.props.imageIndex," - ");
        return nextState.width != this.state.width || nextState.height != this.state.height ;
    }
    onViewportChange(){
        let inView = this.state.inView;
        this.setState({inView : !inView});
        this.calcImageSize(!inView);
    }
    Test=()=>{
        console.log("test");
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
                    {this.state.error ? 
                    <View styles={styles.retryButtoncontainer}>
                        <View style={styles.retryButton}>
                            <Button title="retry" onPress={() => this.Test()} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>
                        </View>
                    </View> 
                    : null} 
                    {this.state.Loading ? 
                        <View styles={styles.retryButtoncontainer}>
                            <View style={styles.retryButton}>
                                <GiftedSpinner styles={styles.Spinner}/>
                            </View>
                        </View> : null}
                    <PhotoView
                        loadingIndicatorSource = {<GiftedSpinner styles={styles.Spinner}/>}
                        source={{uri: this.props.fromWeb ? this.props.source : "file://" + this.props.source}}
                        minimumZoomScale={1}
                        maximumZoomScale={3}
                        androidScaleType="fitCenter"
                        fadeDuration = {200}
                        resizeMethod ={'resize'}
                        style={{width: this.state.width, height:this.state.height,flex: 1}}
                        onLoadStart =  {(e) => this.setState({error : false,Loading : false})}
                        onLoadEnd = {(e) => this.setState({error : false,Loading : false})}
                        onError={(e) => this.setState({error : true,Loading : false})}
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
    retryButtoncontainer:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1
    },
    retryButton: {
        width:100,
        height:50,
       
        position: 'absolute',
        left: (Dimensions.get('window').width / 2) - 50,
        top: (Dimensions.get('window').height / 2) - 75,
        
    },
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