
import React, { Component } from 'react';
import { StyleSheet,View,Text,Dimensions,TextInput,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from '../../Icon/Icon';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import {CreateReview} from "../../../reducers/API/APIActions"
class ReviewScreen extends Component {
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
            headerTitle: ( <View style={{width: Math.round(Dimensions.get("screen").width/1.5)}}><Text style={{color: "#fff"}}>{params ? params.title : ''}</Text></View>),
            headerLeft:  <ButtonIcon name="arrow-left" Color="#fff" onPress={() => navigation.goBack(null)} />,
        };
      };
    state = {
        user : null,
        bookID: null,
        ReviewText: null,
        Rating: null,
        Ratings :  [
            {label:"1", value : "1"},
            {label:"2", value : "2"},
            {label:"3", value : "3"},
            {label:"4", value : "4"},
            {label:"5", value : "5"},
            {label:"6", value : "6"},
            {label:"7", value : "7"},
            {label:"8", value : "8"},
            {label:"9", value : "9"},
            {label:"10", value : "10"},
        ],

        ReviewError:null,
        ReviewErrorMSG: null,
    }
    reRender = this.props.navigation.addListener('willFocus', () => {
        this.setState({ReviewText:null,Rating:null,ReviewError:null,ReviewErrorMSG: null})
    });
    componentWillReceiveProps(NextProps){
        this.setState({user:NextProps.user,ReviewError:NextProps.ReviewError,ReviewErrorMSG: NextProps.ReviewErrorMSG})
    }
    shouldComponentUpdate(nextState,nextProps){
        return true
    }
    componentDidMount(){
       this.setState({bookID : this.props.navigation.getParam("bookID",null),user:this.props.user})
    }
    CreateReview(){
        const Review = {
            book_id : this.state.bookID,
            text : this.state.ReviewText,
            rating : this.state.Rating,
            user : this.state.user.nick,
            dateAdded : new Date().toDateString(),
        }
        this.props.CreateReview(Review);
    }
  
    render() {
        return (
            <View style={styles.container}>
                <View style={{padding:15}}>
                <Text style={styles.textStyle}>Book Rating</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Book Rating...',
                            value: null,
                            color: '#9EA0A4',
                        }}
                        items={this.state.Ratings}
                        onValueChange={(value) => {
                            this.setState({Rating:value})
                        }}
                        style={pickerSelectStyles.inputAndroid}
                        value={this.state.Rating}
                        hideIcon={true}
                    />
                </View>
                <View style={{padding:15,flex:1}}>
                    <Text style={styles.textStyle}>Review Text</Text>
                    <View style={{flex:1,height:250}}>
                        <TextInput
                            onChangeText={(ReviewText) => this.setState({ReviewText})}
                            value={this.state.ReviewText}
                            placeholder="Review Text"
                            placeholderTextColor={"#000"}
                            multiline={true}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={{flex:1,flexDirection:"row",alignContent:"flex-end"}}>
                        <TouchableOpacity onPress={() => this.CreateReview()}>
                            <Text style={styles.textHeader}>Add Review</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle:{
        fontSize: RF(2.5),
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2.5),
    }
});
const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        fontSize: RF(2.5),
        paddingTop: 5,
        paddingBottom: 5,
        color: 'black',
        borderTopWidth: 0
    },
});
const mapStateToProps = state => {
    return {
        user : state.UserReducer.user,
        ReviewError:  state.Reviews.ReviewError,
        ReviewErrorMSG : state.Reviews.ReviewErrorMSG,
    };
};
const mapDispatchToProps = {
    CreateReview
};
export default connect(mapStateToProps, mapDispatchToProps)(ReviewScreen);