import React, { Component } from 'react';
import { StyleSheet, Dimensions, View,TouchableWithoutFeedback} from 'react-native';

import Pdf from 'react-native-pdf';
import Toast from 'react-native-simple-toast';
/**
 * Načítá a zobrazuje pdf knihy.
 */
export default class ReaderPDF extends Component {
    state = {
        page : null,
        source : null,
    }
    /**
     * Nastvavý prop current page na state prop page a prop source na state prop source.
     */
    componentWillReceiveProps(nextProps){
        this.setState({page : nextProps.currentPage,source : nextProps.source})
    }
    /**
     * Kontroluje zda-li se změnily state props.
     */
    shouldComponentUpdate(nextProps,nextState){
        const shouldUpdate = this.state.source && nextState.source ? 
        this.state.source.uri != nextState.source.uri : !this.state.source && nextState.source ? nextState.source.uri ? true : false : false;
        return nextState.page != this.state.page || shouldUpdate
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.source ? this.state.source.uri ?  
                <Pdf
                    enablePaging={this.props.horizontal}
                    enableRTL={this.props.horizontalInv}
                    source={this.props.source}
                    page = {this.state.page}
                    onPageSingleTap = {()=> this.props.showNav()}
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
                : null : null}
               
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