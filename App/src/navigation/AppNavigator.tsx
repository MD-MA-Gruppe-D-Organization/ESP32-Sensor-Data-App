import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import VisualizationScreen from '../screens/VisualizationScreen';
import HorizontalBar from '../screens/HorizontalBar';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Profile: undefined;
  HorizontalBar: { percent: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Visualization" component={VisualizationScreen} />
      <Stack.Screen name="HorizontalBar" component={HorizontalBar} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
