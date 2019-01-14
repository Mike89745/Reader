import React, { Component } from 'react';
import {View,Text} from 'react-native';
import { connect } from 'react-redux'
import {
    UpdateTitles,
  } from '../../../reducers/Chapters/Chapters'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import PouchDB from 'pouchdb-adapters-rn';
import find from 'pouchdb-find';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
PouchDB.plugin(find)
const db = new PouchDB('Library', { adapter: 'pouchdb-adapters-rn'});
class GridItemsHeaderRight extends Component {
    state = {
        books : [],
    }
    componentDidMount(){
        db.allDocs({endkey: '_design'}).then((Response) => {
            let books = [];
            Response.rows.forEach(Book => {
                books.push(Book.id);
            });
            this.setState({books : books});
        }).catch(error => {
            console.log(error);
        })
    }
    render() {
        return (
           
                <Menu>
                    <MenuTrigger>
                        <View>
                            <Icon
                                iconStyle = {{margin: 8,borderWidth:0}}
                                name="dots-vertical"
                                color="#FFF"
                                size={23}
                            />
                        </View> 
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => this.props.UpdateTitles(this.state.books)} ><Text style={{padding: 5}}>Update all titles</Text></MenuOption>
                    </MenuOptions>
                </Menu> 
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = {
    UpdateTitles
};
export default connect(mapStateToProps, mapDispatchToProps)(GridItemsHeaderRight);