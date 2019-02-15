import React, { Component } from 'react';
import { StyleSheet, View,Image } from 'react-native';
import Loading from 'react-native-gifted-spinner';
/**
 * Zobrazuje náhledový obrázek knihy.
 */
export default class Thumbnail extends Component  {
    state = { loaded: false }
    render() {
      return (
        <View style={{flex: 1}}>
          <Image
            source={ this.props.source}
            onLoad={() => this.onLoad()} 
            style ={{flex: 1}}
            resizeMode={"contain"}
            />
          
          {!this.state.loaded ? <Loading style={styles.Spinner}/> : null}

        </View>
      )
    }
    onLoad = () => {
      this.setState(() => ({ loaded: true }))
    }
}
const styles = StyleSheet.create({
  Spinner : {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  } 
});
