
import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import ButtonIcon from '../../Icon/Icon';
import {
    ToggleMainDrawer,
} from '../../../reducers/DrawerNavigation/DrawerNavigationActions';
import { connect } from 'react-redux';
/**
 * Tlačítko na Headeru sloužící k otevírání menu s navigací.
 */
class ToggleMainDrawerButton extends Component {

    render() {
        return (
            <ButtonIcon
                onPress={() => this.props.ToggleMainDrawer()}
                name="menu"
                Color="#fff"
            />
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    ToggleMainDrawer
};
export default connect(mapStateToProps, mapDispatchToProps)(ToggleMainDrawerButton);
