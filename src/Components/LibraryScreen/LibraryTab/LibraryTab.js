
import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import RF from "react-native-responsive-fontsize"
import GridItems from '../../GridItems/GridItems';

export default class LibraryTab extends Component {
    render() {
        return (
            <View style={styles.container}>
                <GridItems isLibrary={true} navigation={this.props.nav} category={this.props.category}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,    
    },
});