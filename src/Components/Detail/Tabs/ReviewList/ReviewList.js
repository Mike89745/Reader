import React, { Component } from 'react';
import { StyleSheet, View,ScrollView,Button,Dimensions} from 'react-native';
import Review from "./Review/Review";
import ButtonIcon from '../../../Icon/Icon'
import { connect } from 'react-redux';
import {getReviewsFromAPI} from "../../../../reducers/API/APIActions"
import Spinner from 'react-native-gifted-spinner';
class ReviewList extends Component {
    state={
        Reviews : null,
        user:null,
        gettingReviews: false,
    }
    AddReview=()=>{
        this.props.screenProps.nav.navigate("ReviewScreen",{bookID : this.props.screenProps.bookID});
    }
    componentWillReceiveProps(NextProps){
        this.setState({user:NextProps.user,Reviews:NextProps.Reviews,gettingReviews: NextProps.gettingReviews})
        
    }
    LoadReviews=()=>{
        this.props.getReviewsFromAPI(this.props.screenProps.bookID);
    }
    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView style={styles.container} nestedScrollEnabled={true}>
                    {this.state.Reviews ? this.state.Reviews.map((item) =>  
                        <Review Review={item.doc}/> ) 
                    :
                    null
                    }
                </ScrollView>
             
                {this.state.user ?  <View style={{position:"absolute", right: 15, bottom: 15,height:50}}>
                    <ButtonIcon name={"plus"} backgroundColor="#3b424c" borderRadius={50} Color="#fff" onPress={() => this.AddReview()}/>
                </View>:null}
                {this.state.Reviews || this.state.gettingReviews ? null:
                    <View style={styles.retryButton}>
                        <Button title="Load Reviews" onPress={() => this.LoadReviews()} color="#3b424c" styles={{ backgroundColor: "#3b424c",color:"white"}}/>
                    </View> 
                }
                {this.state.gettingReviews ? <View styles={styles.retryButtoncontainer}><Spinner style={styles.Spinner}/></View> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        flex: 1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    },
    retryButtoncontainer:{
        backgroundColor:"red",
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1
    },
    retryButton: {
        width:150,
        height:50,
        position: 'absolute',
        left: (Dimensions.get('window').width / 2) - 75,
        top: (Dimensions.get('window').height / 2) - 75,
    },
    Spinner : {
        position: 'absolute',
        left: (Dimensions.get('window').width / 2),
        top: (Dimensions.get('window').height / 2),
    } 
});
const mapStateToProps = state => {
    return {
        user : state.UserReducer.user,
        Reviews : state.Reviews.Reviews,
        gettingReviews : state.Reviews.gettingReviews,
    };
};
const mapDispatchToProps = {
    getReviewsFromAPI
};
export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);