import React, { Component } from 'react';
import { StyleSheet, View,Image } from 'react-native';
import Loading from 'react-native-gifted-spinner';
export default class ThumbNail extends Component  {
    state = { loaded: false }
    render() {
      return (
        <View style={{flex: 1}}>
          <Image
            source={ this.props.source}
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
