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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
class GridItemsHeaderRight extends Component {
    state = {
        books : [],
    }
    componentWillReceiveProps(NextProps){
        let newbookTitles = [];
        NextProps.books.forEach(book => {
            newbookTitles.push(book.id);
        });
        this.setState({books:newbookTitles});
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
        books : state.Booker.CatalogBooks
    };
};
const mapDispatchToProps = {
    UpdateTitles
};
export default connect(mapStateToProps, mapDispatchToProps)(GridItemsHeaderRight);