import * as React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { fetchLastMinutesFromInfluxDB,fetchNewestValueFromInfluxDB } from '../services/api'; // Import your API method
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
  const [newestMeasurement, setNewestMeasurement] = React.useState<Measurement | null>(null); // State to hold the newest measurement


  const showLastMinutesMeasurements = async () => {
    try {
      const topic = 'mdma/1481765933';                                                  // Fetch from topic mdma/"controller-number"
      const minutes = 1;                                                                // Fetch data for the last x minutes
      const data: Measurement[] = await fetchLastMinutesFromInfluxDB(topic, minutes);   // Fetches data from our database
      
      setMeasurements(data);
      
      
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

  // Fetch and display the newest measurement in the list
  const showNewestMeasurement = async () => {
    try {
      const topic = 'mdma/1481765933'; 

      // Fetch newest single measurement
      const newestMeasurementData: Measurement | null = await fetchNewestValueFromInfluxDB(topic);

      // Update state with the newest measurement
      setNewestMeasurement(newestMeasurementData);

      // Log fetched measurement
      if (newestMeasurementData) {
        console.log(`Newest Measurement --- Time: ${newestMeasurementData.time} | Data: ${newestMeasurementData.data} | Host: ${newestMeasurementData.host} | Topic: ${newestMeasurementData.topic}`);
      }

    } catch (error) {
      console.error('Error fetching newest measurement:', error);
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

  // Render newest measurement item
  const renderNewestMeasurement = () => {
    if (newestMeasurement) {
      return (
        <TouchableOpacity style={styles.item}>
          <Text>Measurement Time: {newestMeasurement.time}</Text>
          <Text>Data: {newestMeasurement.data}</Text>
          <Text>Host: {newestMeasurement.host}</Text>
          <Text>Topic: {newestMeasurement.topic}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text>Visualization Screen</Text>
      
      <Button
                title="Horizontal Bar"
                onPress={() => navigation.navigate('HorizontalBar', { percent: 30 })}
            />
      <Button title="Show Newest Measurement" onPress={showNewestMeasurement} />
      <Button title="Fetch Data from API" onPress={showLastMinutesMeasurements} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

      {/* Display measurements in a FlatList */}
      <FlatList
        data={measurements}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`} // Use index as key
        style={{ marginTop: 20, width: '100%' }}
      />

      {/* <View style={{ width: '80%' }}> 
      <HorizontalBar value={0} maxValue={100} /> 
      </View> */}

      {/* Display newest measurement */}
      {renderNewestMeasurement()}
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
