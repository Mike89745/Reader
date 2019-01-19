import React, { Component } from 'react';
import { StyleSheet,View,Text,TouchableOpacity} from 'react-native';
import RF from "react-native-responsive-fontsize"
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
class NavOption extends Component {
    state = {
        ActiveRoute : null
    }
    componentWillReceiveProps(nextProps){
        this.setState({ActiveRoute:nextProps.ActiveRoute});
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigateTo(this.props.RouteName)} >
                    <View style={{flexDirection:"row",alignItems: 'center',backgroundColor: this.state.ActiveRoute === this.props.RouteName ? " rgba(59,66,76,0.5)" : null,padding:5}}>
                        <View style={{marginLeft: 10, marginRight:25}}>
                            <Icon  name={this.props.icon}
                                color = {"#000" }
                                backgroundColor={"rgba(120,120,120,0)" }
                                borderRadius={0}
                                iconStyle = {{margin: 8,borderWidth:0,marginLeft: 15}}
                                size = {20}/>
                        </View>    
                        <Text style={styles.textStyle}>{this.props.RouteName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }
}
const styles = StyleSheet.create({
  
    textStyle:{
        fontSize: RF(2.5),
        color: "black",
        padding: 8,
        
    },
    textHeader:{
        paddingTop: 8,
        fontWeight: 'bold',
        fontSize: RF(3.5),
        color: "black"
    }
});
const mapStateToProps = state => {
    return {
        ActiveRoute : state.DrawerNav.ActiveRoute,
       
    };
};
const mapDispatchToProps = {
   
};

export default connect(mapStateToProps, mapDispatchToProps)(NavOption);