
import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import GridItems from '../../GridItems/GridItems';
/**
 * Jednotlivá kategorie v navigaci
 */
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