/** @format */
import {AppRegistry} from 'react-native';
import 'babel-polyfill'
import App from './App';
import 'core-js/es6/symbol';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
