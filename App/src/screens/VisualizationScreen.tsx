import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { fetchDataFromInfluxDB } from '../services/api'; // Import your API method
import { Measurement } from '../services/Measurement';

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

  const fetchData = async () => {
    try {
      const data: Measurement[] = await fetchDataFromInfluxDB('mdma/1481765933');
      data.forEach((measurement, index) => {
      console.log(`Measurement ${index + 1}:`);
      console.log(`  Time: ${measurement.time}`);
      console.log(`  Data: ${measurement.data}`);
      console.log(`  Host: ${measurement.host}`);
      console.log(`  Topic: ${measurement.topic}`);
      console.log(); // Blank line for readability
    });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Visualization Screen</Text>
      <Button title="Hello World" onPress={handleHelloWorldPress} />
      <Button title="Fetch Data from API" onPress={fetchData} />
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
