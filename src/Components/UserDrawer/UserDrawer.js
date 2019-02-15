import React, { Component } from 'react';
import { StyleSheet,ScrollView,View} from 'react-native';
import {SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import {
    setMainDrawer,
    SetActiveRoute,
} from '../../reducers/DrawerNavigation/DrawerNavigationActions'
import {LoadUser} from "../../reducers/User/UserActions"
import NavOption from "./NavOption/NavOption"
import Auth from './Auth/Auth';
/**
 * Menu sloužící k navigaci v aplikace a přihlašování a registraci.
 */
class UserDrawer extends Component {
    state = {
        navOptions :   [
            {icon:"book",RouteName:"Library"},
            {icon:"table",RouteName:"Catalog"},
            {icon:"book-open-variant",RouteName:"History"},
            {icon:"download",RouteName:"Downloads"},
            {icon:"settings",RouteName:"Settings"}
        ],
    }
    /**
     * Vrátí se na nejnižší bod navigace, nastaví Redux state prop ActiveRoute na routeName pomocí redux metodou setActiveRoute a přejde na vybranou cestu.
     * @param RouteName Jméno cesty
     */
    navigateTo=(routeName)=>{
        this.props.navigation.dispatch(StackActions.popToTop());
        this.props.SetActiveRoute(routeName);
        this.props.navigation.navigate(routeName);
    }
    /**
     * Načte uživatele pomocí redux metody LoadUser, nastavý prop navigace redux state prop MainDrawer pomocí redux metody setMainDrawer a 
     * nastavý Redux state prop ActiveRoute na aktuální cestu.
     */
    componentDidMount(){
        this.props.LoadUser();
        this.props.setMainDrawer(this.props.navigation);
        let navState = this.props.navigation.state;
        this.props.SetActiveRoute(navState.routes[navState.index].routeName);
    }
    

    render() {
        return (
            <ScrollView>
                <SafeAreaView style={{padding:0}} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={styles.container}>
                        <Auth/>
                        {this.state.navOptions ? this.state.navOptions.map((option,index) => (
                            <NavOption RouteName={option.RouteName} navigateTo={this.navigateTo} icon={option.icon} key={option.RouteName}/>))
                        :null}
                    </View>     
                </SafeAreaView>
        </ScrollView>
        )

    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        position: "relative"
    },
});
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    setMainDrawer,
    SetActiveRoute,
    LoadUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDrawer);