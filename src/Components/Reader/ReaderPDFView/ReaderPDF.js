import React, { Component } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

import Pdf from 'react-native-pdf';
import Toast from 'react-native-simple-toast';
export default class ReaderPDF extends Component {
    render() {
        return (
            <View style={styles.container}>
            <Pdf
                enablePaging={this.props.horizontal}
                enableRTL={this.props.horizontalInv}
                source={this.props.source}
                page={this.props.page ? this.props.page : 0}
                onLoadComplete={(numberOfPages,filePath)=>{
                    this.props.setPages(numberOfPages)
                }}
                onPageChanged={(page,numberOfPages)=>{
                    this.props.setCurrentPage(page)
                }}
                onError={(error)=>{
                    console.log(error);
                }}
                style={styles.pdf}/>
        </View>
        )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});