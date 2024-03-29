import React, { Component } from 'react';
import { StyleSheet, View,Dimensions,Image,Button,TouchableWithoutFeedback} from 'react-native';
import PhotoView from 'react-native-photo-view-ex';
import { Viewport } from '@skele/components'
import GiftedSpinner from '../../../../node_modules/react-native-gifted-spinner';
const ViewportAwareView = Viewport.Aware(View)
/**
 * Jedna stránka komixu.
 */
export default class ReaderImage extends Component {
    state = {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
        inView: false,
        error : false,
        Loading : true,
    }
    /**
     * Vypočítá poměr velikosti obrázku k velikosti displeje a podle poměru nastaví state props width a height.
     * @param {*} inView zda-li je obrázek viděť Default state inView
     */
    calcImageSize(inView = this.state.inView){
        if(inView){
            Image.getSize(this.props.fromWeb ? this.props.source : "file://" + this.props.source, (width, height) => {
                const maxWidth = Dimensions.get('window').width;
                const ratio = maxWidth / width;
                this.setState({ width: Math.floor(width * ratio), height: Math.floor(height * ratio)});
                this.props.setHeight(Math.floor(height * ratio),this.props.imageIndex);
            },(err)=>{console.log(err)});
        }
    }
    /**
     * Kontroluje jestli se změnila výška nebo šířka obrázku nebo zda-li se stala chyba.
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.width != this.state.width || nextState.height != this.state.height || nextState.error != this.state.error;
    }
    /**
     * Zavolána při posunu čtečky. Kontroluje zda-li obrázek vidět, pokud ano přepočítá jeho velikost.
     */
    onViewportChange(){
        let inView = this.state.inView;
        this.setState({inView : !inView});
        this.calcImageSize(!inView);
    }
    reload(){
        console.log(this.props.source);
        this.setState({error:false,Loading:true});
    }
    _onLoadStart(e){
        console.log(e);
        this.setState({error : false,Loading : false}) 
    }
    render() {
        return (
            <ViewportAwareView  styles={styles.container} 
            onViewportEnter={() => this.onViewportChange()}
            onViewportLeave={() => this.onViewportChange()}
            onLayout={() => this.calcImageSize(true)}>
                <View style={{width: this.state.width, height:this.state.height,flex: 1,backgroundColor: "black"}}>
                    {this.state.error ? 
                    <View styles={styles.retryButtoncontainer}>
                        <View style={styles.retryButton}>
                            <Button title="retry" onPress={() => this.reload()} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>
                        </View>
                    </View> 
                    :   <PhotoView
                    onTap={() => this.props.showNav()}
                    loadingIndicatorSource = {<GiftedSpinner styles={styles.Spinner}/>}
                    source={{uri: this.props.fromWeb ? this.props.source : "file://" + this.props.source}}
                    minimumZoomScale={1}
                    maximumZoomScale={3}
                    androidScaleType="fitCenter"
                    fadeDuration = {200}
                    resizeMethod ={'resize'}
                    style={{width: this.state.width, height:this.state.height,flex: 1}}
                    onLoadStart =  {(e) => this._onLoadStart(e)}
                    onLoadEnd = {(e) => this.setState({error : false,Loading : false})}
                    onError={(e) => this.setState({error : true,Loading : false})}
                />} 
                    {this.state.Loading ? 
                        <View styles={styles.retryButtoncontainer}>
                            <View style={styles.retryButton}>
                                <GiftedSpinner styles={styles.Spinner}/>
                            </View>
                        </View> : null}
                  
                </View> 
            </ViewportAwareView>
        )

    }
}

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
        backgroundColor: "black",
        flex: 1,
        position:"absolute",
        zIndex: -1,
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