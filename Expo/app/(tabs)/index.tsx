import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

import { useTheme } from "react-native-paper";
import { Measurement, fetchNewestValueFromInfluxDB } from "@/api";
import React, { useEffect, useState } from "react";
import SensorCard from "@/components/SensorCard";

export default function HomeScreen() {
  const theme = useTheme();
  const [measurement, setMeasurement] = useState<Measurement | undefined>(
    undefined
  );

  // Function to handle data refresh
  const handleRefresh = async () => {
    await fetchMeasurement();
  };

  const fetchMeasurement = async () => {
    try {
      const topic = "mdma/1481765933"; // Replace with your actual topic
      const fetchedMeasurement = await fetchNewestValueFromInfluxDB(topic);

      if (!fetchedMeasurement) {
        throw new Error("fetchedMeasurement is faulty");
      }

      if (measurement?.influx.value !== fetchedMeasurement.influx.value) {
        setMeasurement(fetchedMeasurement);
      }
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
