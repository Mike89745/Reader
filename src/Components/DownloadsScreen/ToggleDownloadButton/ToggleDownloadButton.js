import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import ButtonIcon from '../../Icon/Icon';
import {
    toggleDownloads,
  } from '../../../reducers/downloader/downloaderActions';
import { connect } from 'react-redux';
class ToggleDownloadButton extends Component {
    state = {
        isPaused : null,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isPaused: nextProps.isPaused});  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isPaused != this.state.isPaused;
    }
    componentDidMount(){
        this.setState({ isPaused: this.props.isPaused});  
    }
    render() {
        return (
                <ButtonIcon
                    onPress={() => this.props.toggleDownloads()}
                    name={this.state.isPaused ? "play" : "pause"}
                    Color="#ffffff"
                />
        )
    }
}
const mapStateToProps = state => {
    return {
        isPaused : state.downloads.isPaused,
    };
};
const mapDispatchToProps = {
    toggleDownloads
};
export default connect(mapStateToProps, mapDispatchToProps)(ToggleDownloadButton);
