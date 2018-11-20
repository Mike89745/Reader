import React, { Component } from 'react';
import { StyleSheet, View,Image,Text } from 'react-native';
import Spinner from 'react-native-gifted-spinner';
import LinearGradient from 'react-native-linear-gradient';
export default class ThumbNail extends Component  {
    state = { loaded: false }
    render() {
      return (
        <View style={styles.container}>
          <Image
            source={{uri: "http://localhost:8000/getthumbnail/XD.png"}}
            onLoad={() => this._onLoad()}
            resizeMode="cover"
            />
            <LinearGradient style={styles.TitleContainer} colors={['transparent', '#3b424c']}>
              <Text numberOfLines={2} style={{color:"#FFF"}}>{this.props.title ? this.props.title : 'Sample Title Sample Title XDDDDD'}</Text>
            </LinearGradient>
            {!this.state.loaded ? <Spinner style={styles.Spinner}/> : null}
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
    flex : 1,
  },
  TitleContainer: {
    paddingTop: 5,
    paddingLeft: 3,
    paddingRight : 3,
    width: '100%', 
    height:50,
    position: 'absolute',
    bottom: 0,
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: "row",
  },
  Spinner : {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
} 
});
