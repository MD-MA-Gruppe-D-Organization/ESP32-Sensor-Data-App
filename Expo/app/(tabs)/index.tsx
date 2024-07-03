import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { Measurement, fetchAllTopicsFromInfluxDB, fetchNewestValueFromInfluxDB } from "@/api";
import React, { useEffect, useState } from "react";
import SensorCard from "@/components/SensorCard";
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const theme = useTheme();
  const [measurement, setMeasurement] = useState<Measurement[]>([]);  // State to hold an array of measurements
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [binSizes, setBinSizes] = useState<Record<string, number>>({}); 
  const [locations, setLocations] = useState<Record<string, string>>({}); // State to hold a mapping of hostNames to locations

  // Initialize storage with AsyncStorage backend
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
  });

  // Function to load locations and bin sizes for a list of hostNames
  async function loadStoragee(hostNames: string[]): Promise<void> {
    try {
      // Fetch locations and bin sizes for each hostName
      const results = await Promise.all(
        hostNames.map(async (hostName) => {
          try {
            const storedLocation = await storage.load({ key: hostName }).catch(() => "");
            const storedBinSize = await storage.load({ key: `${hostName}binSize` }).catch(() => 100);
            return { hostName, storedLocation, storedBinSize };
          } catch (error) {
            console.error(`Error loading data for ${hostName}:`, error);
            return { hostName, storedLocation: "", storedBinSize: 100 };
          }
        })
      );

      // Convert the results into objects for easy lookup
      const locationsMap = Object.fromEntries(results.map(({ hostName, storedLocation }) => [hostName, storedLocation]));
      const binSizesMap = Object.fromEntries(results.map(({ hostName, storedBinSize }) => [hostName, storedBinSize]));

      // Update the states
      setLocations(locationsMap);
      setBinSizes(binSizesMap);
    } catch (error) {
      console.error("Error loading storage:", error);
    }
  }

  // Handle edits to binSize and location and save them to storage
  const handleEdit = async (binSize: number | undefined, location: string | undefined, hostName: string) => {
    if (binSize !== undefined) {
      setBinSizes((prevBinSizes) => ({ ...prevBinSizes, [hostName]: binSize }));
    }
    if (location !== undefined) {
      setLocations((prevLocations) => ({ ...prevLocations, [hostName]: location }));
    }

    try {
      if (binSize !== undefined) {
        await storage.save({ key: `${hostName}binSize`, data: binSize });
      }
      if (location !== undefined) {
        await storage.save({ key: hostName, data: location });
      }
      console.log("saved");
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  };

  // Function to handle data refresh
  const handleRefresh = async () => {
    setIsLoadingRefresh(true);
    try {
      const topics = await fetchAllTopicsFromInfluxDB();
      await loadStoragee(topics);
      await fetchMeasurement(topics);  // Fetch measurements for all topics
    } finally {
      setIsLoadingRefresh(false);
    }
  };

  // Function to fetch measurements for a list of topics
  const fetchMeasurement = async (topics: string[]) => {
    try {
      // Fetch measurements for all topics
      const measurements = await Promise.all(
        topics.map((topic) =>
          fetchNewestValueFromInfluxDB(topic, binSizes[topic] || 100, locations[topic] || "", topic)
        )
      );

      // Filter out null or undefined measurements
      const validMeasurements = measurements.filter(
        (measurement) => measurement !== null
      ) as Measurement[];

      // Update state with valid measurements
      setMeasurement(validMeasurements);
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const topics = await fetchAllTopicsFromInfluxDB();
        await loadStoragee(topics);
        await fetchMeasurement(topics);  // Fetch measurements on initial render
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initializeData();
  }, []);  // Runs only on initial render

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 32,
      }}
    >
      <ScrollView>
        {measurement.map((data, index) => (
          <SensorCard
            key={data.influx.id ?? `random-${index}`} // Ensure unique key based on measurement id
            handleRefresh={handleRefresh}
            index={index}
            measurement={data}
            onEdit={(binSize, location) => handleEdit(binSize, location, data.metaData.hostName)}
            binSize={binSizes[data.metaData.hostName] || 100}
            location={locations[data.metaData.hostName] || ""}  // Get the location for the current hostName
            loadingRefresh={isLoadingRefresh}
            hostName={data.metaData.hostName} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
