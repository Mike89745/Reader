import React, { Component } from 'react';
import { StyleSheet, View,Image } from 'react-native';
import Spinner from 'react-native-gifted-spinner';
export default class ThumbNail extends Component  {
    state = { loaded: false }
    render() {
      return (
        <View style={styles.container}>
          <Image
            source={this.props.source}
            onLoad={() => this._onLoad()}
            style={{height: this.props.height, width: this.props.width}}
            resizeMode="contain"
            />
            {!this.state.loaded ? <Spinner/> : null}
        </View>
      )
    }
    _onLoad = () => {
      this.setState(() => ({ loaded: true }))
    }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    flex : 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d6d7da',
  }, 
});
