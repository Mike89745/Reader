import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import ButtonIcon from '../../Icon/Icon';
import {
    toggleDownloads,
  } from '../../../reducers/downloader/downloaderActions';
import { connect } from 'react-redux';
/**
 * Slouží k pozastavení a obnovení stahování
 */
class ToggleDownloadButton extends Component {
    state = {
        isPaused : null,
    }
    /**
     * Nastaví Redux state prop IsPaused na state prop.
     */
    componentWillReceiveProps(nextProps) {
        this.setState({ isPaused: nextProps.isPaused});  
    }
    /**
     * Kontroluje jestli se IsPaused změnilo.
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isPaused != this.state.isPaused;
    }
    render() {
        return (
                <ButtonIcon
                    onPress={() => this.props.toggleDownloads()}
                    name={this.state.isPaused ? "pause" : "play"}
                    Color="#ffffff"
                />
        )
    }
}
const mapStateToProps = state => {
    return {
        isPaused : state.Downloader.isPaused,
    };
};
const mapDispatchToProps = {
    toggleDownloads
};
export default connect(mapStateToProps, mapDispatchToProps)(ToggleDownloadButton);
