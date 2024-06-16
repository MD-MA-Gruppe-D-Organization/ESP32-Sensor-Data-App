import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Visualization: undefined;
};

type VisualizationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Visualization'>;
type VisualizationScreenRouteProp = RouteProp<RootStackParamList, 'Visualization'>;

type Props = {
  navigation: VisualizationScreenNavigationProp;
  route: VisualizationScreenRouteProp;
};

const VisualizationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Visualization Screen</Text>
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
