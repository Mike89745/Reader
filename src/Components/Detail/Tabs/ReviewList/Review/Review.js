import React, { Component } from 'react';
import { StyleSheet, View, Text,Button} from 'react-native';
import RF from "react-native-responsive-fontsize"
import ButtonIcon from "../../../../Icon/Icon"
export default class Chapter extends Component {
    state = {
        visible : false,
    }
    onPress = () =>{
        let visible = this.state.visible
        this.setState({visible : !visible});
    }
    render() {
        return ( 
            <View style={styles.container} >
                <View style={styles.smallContainer} >
                    <View style={{flex:0.8}}>
                        <Text style={styles.textHeader}>{this.props.userName}</Text>
                        <Text style={styles.textDate}>Rating {this.props.Rating}/10</Text>
                    </View>
                    <View style={{flex:0.2,alignItems:"flex-end",}}>
                         <ButtonIcon
                            onPress={() => this.onPress()}
                            name="chevron-down"
                            Color="#000"
                        />
                    </View>
                </View>
                {this.state.visible ?  <View>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget felis eu est posuere auctor. Sed ornare nulla pharetra, venenatis tellus in, lacinia felis. Sed porttitor vestibulum lacinia. Pellentesque quis velit quis est iaculis posuere. Fusce ultricies augue non dolor scelerisque, id laoreet quam faucibus. Cras dictum egestas arcu. Sed purus quam, suscipit at tempor nec, rhoncus ut risus. Aenean efficitur dapibus imperdiet. Duis suscipit placerat pharetra.</Text>
                </View> : null }
                
            </View>
        ) 
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d6d7da',
        paddingLeft : 5,
        paddingRight : 5,
        paddingTop: 5,
        paddingBottom: 5,
    },

    smallContainer: {
        flex: 1, 
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    textHeader:{
        fontWeight: 'bold',
        fontSize: RF(2),
        paddingBottom: 3,
        paddingTop: 3,
    },
    textDate:{
        fontSize: RF(1.5),
        paddingBottom: 3,
    },
   
});