import React, { Component } from 'react';
import { StyleSheet, View,Image,Text } from 'react-native';
import Spinner from 'react-native-gifted-spinner';
import LinearGradient from 'react-native-linear-gradient';
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
PouchDB.plugin(find)
const chapters = new PouchDB('Chapters', { adapter: 'pouchdb-adapters-rn'});
export default class GridItem extends Component  {
    state = { loaded: false,unReadChapters: null }
    componentWillMount(){
      if(this.props.isLibrary){
        chapters.createIndex({
          index: {
            fields: ['book_id']
          }
        }).then(() => {
          return chapters.find({
            selector: {
              book_id : {$eq : this.props.title},
            }
            }).then(response => {
              let Total = response.docs.length;
              let unReadChapters = response.docs.filter((chapter) => {return chapter.MarkedAsRead === true}).length;
              this.setState({unReadChapters : Total - unReadChapters});
            }).catch(err => {
              console.log(err);
            });
        }).catch(err => {
          console.log(err);
        })
      }
    }
    render() {
      return (
        <View style={styles.container}>
         
          <Image
            source={this.props.source}
            style={{flex:1}}
            onLoad={() => this._onLoad()}
            resizeMode="cover"
            />
            {this.state.unReadChapters ? <View style={[styles.unReadChaptersContainer,{width: (this.state.unReadChapters.toString().length * 5) + 25 - 5}]}>
              <Text style={{color:"#FFF",padding:2}}>{this.state.unReadChapters}</Text>
            </View> : null}
            
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
    maxHeight: 250,
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
  unReadChaptersContainer:{
    backgroundColor:"#3b424c",
    height: 25,
    position: 'absolute',
    top: 5,
    right : 5,
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
