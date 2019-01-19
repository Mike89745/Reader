import React, { Component } from 'react';
import { StyleSheet,Text,TouchableOpacity,Animated,View} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { connect } from 'react-redux'
import {SyncDbs,SignOut} from "../../../../reducers/User/UserActions"
import AreYouSureModal from "../../../Modals/AreYouSureModal"
class User extends Component {
    render() {
        return (
            
            <View>
                 <AreYouSureModal 
                    yes={this.props.SignOut} 
                    text={"Are you sure you want to sign out?"} 
                    ref={(ref) => this.SignOutModal = ref}>
                </AreYouSureModal>
                <Animated.View style={{borderBottomWidth: 1, borderBottomColor: "#000",marginBottom:0,padding:5,backgroundColor:"#3b424c"}}>
                    <Text style={[styles.textHeader,{color:"white"}]}>{this.props.user.nick}</Text>
                    <TouchableOpacity onPress={() => this.props.SyncDbs()} style={{alignSelf:"flex-end"}}>
                        <Text style={styles.textSignIn}>Synchronize</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.SignOutModal.toggleModal()} style={{alignSelf:"flex-end"}}>
                        <Text style={styles.textSignIn}>Sign out</Text>
                    </TouchableOpacity>
                </Animated.View> 
            </View>
        )

    }
}
const styles = StyleSheet.create({
  
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        padding: 8,
        paddingBottom: 0,
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    },
    textSignIn:{
        fontSize: RF(3),
        color: "white",
        padding: 8
    },
});
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    SyncDbs,
    SignOut
};

export default connect(mapStateToProps, mapDispatchToProps)(User);