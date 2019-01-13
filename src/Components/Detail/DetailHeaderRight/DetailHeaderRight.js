import React, { Component } from 'react';
import {View} from 'react-native';
import ButtonIcon from '../../Icon/Icon';
import { connect } from 'react-redux'
import {downloadAll} from "../../../reducers/downloader/downloaderActions"
import {
    UpdateTitles,
  } from '../../../reducers/Chapters/Chapters'
import PopUpMenu from '../../PopUpMenu/PopUpMenu';
class Description extends Component {
    render() {
        return (
            <View style={{flexDirection : "row",flex: 1,
            justifyContent: 'center',
            alignItems: 'center',marginRight:15}}> 
               <ButtonIcon name="refresh" Color="#fff" onPress={() => this.props.UpdateTitles([this.props.bookID])} />
               <PopUpMenu Color="#ffffff" name="dots-vertical" options={[{text: "Download All",onSelect:this.props.downloadAll}]}></PopUpMenu>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    downloadAll,
    UpdateTitles
};
export default connect(mapStateToProps, mapDispatchToProps)(Description);