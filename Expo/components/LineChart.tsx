import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import { fetchAllMeasurementsToTopicFromInfluxDB } from "@/api";
import { DateTime } from "luxon";

interface LineChartProps {
  topic: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ topic }) => {
  const theme = useTheme();
  const [measurement, setMeasurement] = useState<string[]>([]); // State to hold an array of measurements
  const [values, setValues] = useState<number[]>([0]); // State to hold an array of measurements

  const fetchMeasurementsForTopic = async () => {
    const response = await fetchAllMeasurementsToTopicFromInfluxDB(topic);
    const responseSet = new Set(response);
    return [...responseSet].slice(-12);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await fetchMeasurementsForTopic();

        setMeasurement(response!.map((value) => value![0] ?? "-").reverse());
        setValues(response!.map((value) => parseFloat(value![1]) ?? -1));
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    initializeData();
  }, []);

  return (
    <LineChart
      data={{
        labels: measurement.map((time) =>
          DateTime.fromISO(time)
            .setZone("Europe/Berlin")
            .toLocaleString(DateTime.TIME_24_WITH_SECONDS, {
              locale: "de-DE",
            })
        ),
        datasets: [
          {
            data: values,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2, // optional
          },
        ],
        legend: ["fill-level"], // optional
      }}
      width={Dimensions.get("window").width} // from react-native
      height={Dimensions.get("window").height * 0.5}
      yAxisInterval={1} // optional, defaults to 1
      verticalLabelRotation={60}
      yAxisSuffix="cm"
      chartConfig={{
        backgroundColor: theme.colors.background,
        backgroundGradientFrom: theme.colors.background,
        backgroundGradientTo: theme.colors.background,
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => theme.colors.onBackground,
        labelColor: (opacity = 1) => theme.colors.onBackground,
        style: {
          borderRadius: 16,
        },
      }}
      style={{ borderRadius: 4 }}
      bezier
    />
  );
};

export default LineChartComponent;
