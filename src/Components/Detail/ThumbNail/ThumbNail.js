import React, { Component } from 'react';
import { StyleSheet, View,Image } from 'react-native';
import Loading from 'react-native-gifted-spinner';
export default class ThumbNail extends Component  {
    state = { loaded: false }
    render() {
      return (
        <View style={{flex: 1}}>
          <Image
            source={{uri : "https://firebasestorage.googleapis.com/v0/b/mangareader-5f322.appspot.com/o/22916.jpg?alt=media&token=18749891-1693-4f4c-9499-4f55bf00fd54"}}
            onLoad={() => this._onLoad()} 
            style ={{flex: 1}}
            resizeMode={"contain"}
            />
          
          {!this.state.loaded ? <Loading/> : null}

        </View>
      )
    }
    _onLoad = () => {
      this.setState(() => ({ loaded: true }))
    }
}
