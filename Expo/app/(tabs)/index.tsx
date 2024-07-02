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

  // Initialize storage with AsyncStorage backend
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
  });

  useEffect(() => {
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
  }, []);

  // Handle edits to binSize and location and save them to storage
  const handleEdit = async (
    binSize: number | undefined,
    location: string | undefined
  ) => {
    setBinSize(binSize);
    setLocation(location);

    try {
      await storage.save({
        key: "binSize",
        data: binSize,
      });

      await storage.save({
        key: "location",
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
            key={data.influx.id}  // Unique key based on measurement id
            handleRefresh={handleRefresh}
            index={index}
            measurement={data}
            onEdit={(binSize, location) => handleEdit(binSize, location)}
            binSize={binSize}
            location={location}
            loadingRefresh={isLoadingRefresh}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
