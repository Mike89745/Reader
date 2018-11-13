import React, { Component } from 'react';
import { StyleSheet, View, Dimensions,BackHandler,Text,ScrollView } from 'react-native';
import Info from "./Info/Info";
import ThumbNail from "./ThumbNail/ThumbNail";
import Axios from 'react-native-axios';
import Loading from "react-native-gifted-spinner";
import Description from "./Description/Description";
import TagList from "./TagList/TagList";
import { HeaderBackButton } from 'react-navigation';
import Tabs from "./Tabs/Tabs"
import Spinner from 'react-native-gifted-spinner';
import ButtonIcon from '../Icon/Icon';
export default class Detail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: '#3b424c',
                
                shadowColor: "#fff",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity:0,
                shadowRadius: 0,

                elevation: 0,
              },
            headerTitle: ( <Text style={{color: "#fff"}}> {params ? params.title : ''}</Text> ),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
        };
      };
    state ={
        info : " ",
        thumbNailSource : {uri : "https://firebasestorage.googleapis.com/v0/b/mangareader-5f322.appspot.com/o/22916.jpg?alt=media&token=18749891-1693-4f4c-9499-4f55bf00fd54"},
        infoLoading : false,
        size : 150,
        height : 0,
    }
    getInfo = () => {
        this.setState({infoLoading : true});
        Axios.request("https://mangareader-5f322.firebaseio.com/Info.json").then(Response => {
            this.setState({info : Response.data, infoLoading : false});
            this.props.navigation.setParams({title: Response.data.Name});
        })
        .catch(error => console.log(error));
    }
    componentDidMount(){
        this.getInfo();
        let size = this.state.size;
        let height = Math.floor(Dimensions.get('window').height/3);
        if(Dimensions.get('window').width < 500){
            size = 150;
        }else{
            size = Math.floor(Dimensions.get('window').width/3) - 10;
        }
        this.setState({size : size, height: height});
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <ScrollView>
                {this.state.loading ? <Spinner style={styles.Spinner}/> :
                <View> 
                    <View style={{flexDirection : "row",padding: 10, height : this.state.height, backgroundColor: "#Dee"}}>
                        <View style={{width : this.state.size,paddingRight: 10}}>
                            <ThumbNail source={this.state.thumbNailSource}/>
                        </View>
                        <Info style={styles.Info} info={this.state.info}/>
                    </View>
                    <View style={styles.content}>
                        <Description info={this.state.info}/>
                        <TagList tags={this.state.info.Tag}/>
                    </View>
                    <Tabs/>
                </View>
                }
               
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    content:{
        flex: 1,
        padding: 10,
    },
    ThumbNail:{
        flex : 2,
        marginRight : 10,
    },
    Info :{
        flex : 1,
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