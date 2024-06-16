import * as React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Visualization: undefined;
};

type VisualizationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Visualization'
>;
type VisualizationScreenRouteProp = RouteProp<RootStackParamList, 'Visualization'>;

export type VisualizationScreenProps = {
  navigation: VisualizationScreenNavigationProp;
  route: VisualizationScreenRouteProp;
};

const VisualizationScreen: React.FC<VisualizationScreenProps> = ({ navigation }) => {
  const handleHelloWorldPress = () => {
    console.log('Hello World button pressed!');
  };

  return (
    <View style={styles.container}>
      <Button title="Hello World" onPress={handleHelloWorldPress} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VisualizationScreen;
