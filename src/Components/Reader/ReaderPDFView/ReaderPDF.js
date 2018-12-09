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
                page={10}
                horizontal={this.props.horizontal}
                ref={(ref) => { this.pdfRef = ref; }}
                onLoadComplete={(numberOfPages,filePath)=>{
                    this.props.setPages(numberOfPages)
                }}
                onPageChanged={(page,numberOfPages)=>{
                    this.props.setPages(numberOfPages)
                    this.props.setCurrentPage(page)
                }}
                onError={(error)=>{
                    Toast.show("Error Loading PDF",Toast.LONG)
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