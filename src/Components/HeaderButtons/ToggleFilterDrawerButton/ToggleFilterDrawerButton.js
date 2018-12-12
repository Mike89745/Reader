
import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import ButtonIcon from '../../Icon/Icon';
import {
    ToggleFilterDrawer,
} from '../../../reducers/DrawerNavigation/DrawerNavigationActions';
import { connect } from 'react-redux';
class ToggleFilterDrawerButton extends Component {

    render() {
        return (
            <ButtonIcon
                onPress={() => this.props.ToggleFilterDrawer()}
                name="filter"
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
    ToggleFilterDrawer
};
export default connect(mapStateToProps, mapDispatchToProps)(ToggleFilterDrawerButton);
