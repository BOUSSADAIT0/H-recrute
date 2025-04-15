import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Remplacer cette ligne
// AppRegistry.registerComponent(appName, () => App);

// Par celle-ci
AppRegistry.registerComponent(appName, function() { return App; });