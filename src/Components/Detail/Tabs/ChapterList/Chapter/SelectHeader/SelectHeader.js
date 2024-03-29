
import React, { Component } from 'react';
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import ButtonIcon from '../../../../../Icon/Icon';
import { connect } from 'react-redux'
import PopUpMenu from '../../../../../PopUpMenu/PopUpMenu';
import {
    toggleSelectHeader,
    getchapterRefs,
    selectAll,
    deselectedAll,
    deleteSelected,
    donwloadSelectedChapters,
    markAsRead,
    unmarkAsRead,
  } from '../../../../../../reducers/downloader/downloaderActions'
  /**UI pro vybírání kapitol */
class SelectHeader extends Component {
    render() {
        return (
            
            <View style={{flex: 1,height : 50, backgroundColor: "#3b424c",flexDirection:"row",width: Dimensions.get("screen").width,position: 'absolute',
            top:0, zIndex : 100,
            }}>
               <View style={{flexDirection:"row",alignContent:"flex-start"}}>
                <ButtonIcon
                        onPress={() => this.props.toggleSelectHeader()}
                        name="close"
                        Color="#ffffff"
                    />
                </View>
                <View style={{flexDirection:"row",alignContent:"flex-end",justifyContent:"flex-end",flex: 1,marginRight: 15}}>
                    <ButtonIcon
                        onPress={() => this.props.donwloadSelectedChapters()}
                        name="download"
                        Color="#ffffff"
                    />
                      <ButtonIcon
                        onPress={() => this.props.deleteSelected()}
                        name="delete"
                        Color="#ffffff"
                    />
                    <View style={{
                        flexDirection : "row",
                        justifyContent: 'center',
                        alignItems: 'center'}}
                    >
                        <PopUpMenu Color="#ffffff" name="dots-vertical" options={[
                            {text: "Select all",onSelect:this.props.selectAll},
                            {text:"Mark as read",onSelect: this.props.markAsRead},
                            {text: "Mark as unread",onSelect:this.props.unmarkAsRead}]}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    toggleSelectHeader,
    getchapterRefs,
    selectAll,
    deselectedAll,
    deleteSelected,
    donwloadSelectedChapters,
    markAsRead,
    unmarkAsRead,
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectHeader);
