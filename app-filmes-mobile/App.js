import 'react-native-gesture-handler'
import Routes from './src/routes';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {AppRegistry} from 'react-native';

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
      <StatusBar style="light" translucent />
    </NavigationContainer>
  );
}
AppRegistry.registerComponent('Appname', () => App);