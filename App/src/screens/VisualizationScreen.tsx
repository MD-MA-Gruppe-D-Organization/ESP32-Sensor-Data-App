import * as React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
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
  
  const [measurements, setMeasurements] = React.useState<Measurement[]>([]); // State to hold measurements

  const handleHelloWorldPress = () => {
    console.log('Hello World button pressed!');
  };

  const fetchData = async () => {
    try {
      const topic = 'mdma/1481765933';                                          // Fetch from topic mdma/"controller-number"
      const minutes = 1;                                                       // Fetch data for the last 60 minutes
      const data: Measurement[] = await fetchDataFromInfluxDB(topic,minutes);   // Fetches data from our database
      
      setMeasurements(data);

      // @Nick ab hier hast du die Daten der letzten x minuten zugänglich ---> vielleicht in einer anderen Methode weitermachen?

      
      
      // Print measurements
    console.log('----------------------------------------');
    data.forEach((measurement, index) => {
      console.log(`Measurement ${index + 1} --- Time: ${measurement.time} | Data: ${measurement.data} | Host: ${measurement.host} | Topic: ${measurement.topic}`);
      console.log();
    });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: Measurement }) => (
    <TouchableOpacity style={styles.item}>
      <Text>Measurement Time: {item.time}</Text>
      <Text>Data: {item.data}</Text>
      <Text>Host: {item.host}</Text>
      <Text>Topic: {item.topic}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Visualization Screen</Text>
      <Button title="Hello World" onPress={handleHelloWorldPress} />
      <Button title="Fetch Data from API" onPress={fetchData} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

      {/* Display measurements in a FlatList */}
      <FlatList
        data={measurements}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`} // Use index as key
        style={{ marginTop: 20, width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: { // Ensure 'item' style is properly defined
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
export default VisualizationScreen;
