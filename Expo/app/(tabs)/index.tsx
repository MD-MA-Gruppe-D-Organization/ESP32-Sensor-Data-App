import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

import { useTheme } from "react-native-paper";
import { Measurement, fetchAllTopicsFromInfluxDB, fetchNewestValueFromInfluxDB } from "@/api";
import React, { useEffect, useState } from "react";
import SensorCard from "@/components/SensorCard";
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const theme = useTheme();
  const [measurement, setMeasurement] = useState<Measurement | undefined>(
    undefined
  );
  const [binSize, setBinSize] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);

  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
  });

  useEffect(() => {
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
          // Handle the case where the values are not found
          console.log("Values not found in storage");
          // You can also set default values here
          setBinSize(100); // or some default value
          setLocation(""); // or some default value
        }
      } catch (error) {
        console.error("Error loading storage:", error);
      }
    }

    loadStorage();
  }, []);

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
    await fetchAllTopicsFromInfluxDB();
    await fetchMeasurement();
    setIsLoadingRefresh(false);
  };

  const fetchMeasurement = async () => {
    try {
      const topic = "mdma/1481765933"; //TODO remove hard coded topic
      const fetchedMeasurement = await fetchNewestValueFromInfluxDB(
        topic,
        binSize,
        location
      );

      if (!fetchedMeasurement) {
        throw new Error("fetchedMeasurement is faulty");
      }

      setMeasurement(fetchedMeasurement);
    } catch (error) {
      console.error("Error fetching measurement:", error);
    }
  };

  useEffect(() => {
    fetchMeasurement();
  }, []); // Fetch measurement on initial render

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 32,
      }}
    >
      <ScrollView>
        {[measurement].map((data, index) => (
          <SensorCard
            key={measurement?.influx.id}
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

const steps = [
  {
    title: "Sensor 1",
    progress: 20,
    time: "2024-06-21T16:16:01.000Z",
    host: "b668bbddf4e1",
    topic: "mdma/1481765933",
    binSize: 100,
  },
  {
    title: "Sensor 2",
    progress: 96,
    time: "2024-06-21T16:16:01.000Z",
    host: "b668bbddf4e1",
    topic: "mdma/1481765933",
    binSize: 150,
  },
  {
    title: "Sensor 3",
    progress: 148,
    time: "2024-06-21T16:16:01.000Z",
    host: "b668bbddf4e1",
    topic: "mdma/1481765933",
    binSize: 200,
  },
];
