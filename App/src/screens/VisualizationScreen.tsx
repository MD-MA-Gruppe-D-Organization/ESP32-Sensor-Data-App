import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { fetchDataFromInfluxDB } from '../services/api'; // Import your API method

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
      const data = await fetchDataFromInfluxDB('mdma/1481765933');
      console.log('Fetched data:', data);
      if (data.results && data.results[0].series) {
        data.results[0].series.forEach((seriesItem: any) => {
          console.log('Series name:', seriesItem.name);
          console.log('Series columns:', seriesItem.columns);
          console.log('Series values:', seriesItem.values);
        });
      } else {
        console.log('No series data found.');
      }
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
