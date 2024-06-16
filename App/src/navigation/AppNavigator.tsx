import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import VisualizationScreen from '../screens/VisualizationScreen';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Visualization" component={VisualizationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
