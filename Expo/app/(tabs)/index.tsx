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
  const [binSize, setBinSize] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [locations, setLocations] = useState<Record<string, string>>({}); // State to hold a mapping of hostNames to locations

  // Initialize storage with AsyncStorage backend
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
  });

  /* useEffect(() => {

    // Function to load binSize and location from storage
    async function loadStorage() {
      try {
        const storedBinSize = await storage.load({
          key: "binSize",
        });

        const storedLocation = await storage.load({
          key: "location",
        });

        if (storedBinSize && storedLocation) {
          setBinSize(storedBinSize);
          setLocation(storedLocation);
        } else {
          // Set default values if no stored values are found
          console.log("Values not found in storage");
          setBinSize(100); // Default binSize
          setLocation(""); // Default location
        }
      } catch (error) {
        console.error("Error loading storage:", error);
      }
    }

    loadStorage();
  }, []); */

// Function to load locations for a list of hostNames
async function loadStoragee(hostNames: string[]): Promise<void> {
  try {

    // Fetch locations for each hostName
    const locationsFetched = await Promise.all(
      hostNames.map(async (hostName) => {
        try {
          const storedLocation = await storage.load({
          key: hostName,
          }).catch(() => ""); // Default to empty string if there’s an error or storedLocation is undefined

          return [hostName, storedLocation || ""] as [string, string]; // Ensure storedLocation is not undefined
        } catch (error) {
          console.error(`Error loading location for ${hostName}:`, error);
          return [hostName, ""]; // Return an empty string or some default value if location is not found
        }
      })
    );

    // Convert the array of tuples into an object for easy lookup
    const locationsMap = Object.fromEntries(locationsFetched);

    // Update the locations state
    setLocations(locationsMap);

  } catch (error) {
    console.error("Error loading storage:", error);
  }
}

  // Handle edits to binSize and location and save them to storage
  const handleEdit = async (
    binSize: number | undefined,
    location: string | undefined,
    hostName: string,
  ) => {
    setBinSize(binSize);
    setLocation(location);

    try {
      await storage.save({
        key: "binSize",
        data: binSize,
      });

      await storage.save({
        key: hostName,
        data: location,
      });

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

      loadStoragee(topics);

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
          fetchNewestValueFromInfluxDB(topic, binSize, location,topic)
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
        loadStoragee(topics);
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
            key={data.influx.id} // Unique key based on measurement id
            handleRefresh={handleRefresh}
            index={index}
            measurement={data}
            onEdit={(binSize, location) => handleEdit(binSize, location, data.metaData.hostName)}
            binSize={binSize}
            location={locations[data.metaData.hostName] || ""}  // Get the location for the current hostName
            loadingRefresh={isLoadingRefresh} hostName={""}          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
