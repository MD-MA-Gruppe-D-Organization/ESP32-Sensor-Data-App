const INFLUXDB_URL = "http://10.0.2.2:8086/query"; // When you run the project on an Android device, localhost is pointing to ur computer instead of the Android device so I changed http://localhost:3030 to http://10.0.2.2:3030
const BUCKET = "iot_data";
const API_TOKEN = "DD85150B-3871-4622-8D14-45BFE743C270"; // token is never changing

interface InfluxDBResponse {
  results: {
    series?: [
      {
        name: string;
        columns: string[];
        values: [string, string][]; // Array of arrays where each inner array contains a topic header and a topic string
      }
    ];
  }[];
}

export const fetchNewestValueFromInfluxDB = async (
  topic: string,
  binSize = 100,
  location: string | undefined,
  hostName: string
): Promise<Measurement | null> => {
  try {
    const query = `SELECT * FROM "mqtt_consumer" WHERE "topic" = '${topic}' ORDER BY time DESC LIMIT 1`;
    const url = `${INFLUXDB_URL}?pretty=true&db=${BUCKET}&q=${encodeURIComponent(
      query
    )}&u=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { results } = await response.json();

    if (
      !results ||
      !results[0].series ||
      !results[0].series[0].values ||
      !results[0].series[0].values[0]
    ) {
      return null; // No data available for the specified topic
    }

    const [time, value, host, id, fetchedTopic] =
      results[0].series[0].values[0];

    if (fetchedTopic !== topic) {
      throw new Error(
        `Unexpected topic '${fetchedTopic}' fetched from InfluxDB.`
      );
    }

    return {
      influx: { host: host, id: id, time: time, topic: topic, value: value },
      metaData: {
        binSize: binSize,
        location: location ?? "-",
        hostName: hostName ?? "-",
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchAllMeasurementsToTopicFromInfluxDB = async (
  topic: string
) => {
  try {
    const query = `SELECT * FROM "mqtt_consumer" WHERE "topic" = '${topic}' ORDER BY time DESC LIMIT 100`;
    const url = `${INFLUXDB_URL}?pretty=true&db=${BUCKET}&q=${encodeURIComponent(
      query
    )}&u=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { results }: InfluxDBResponse = await response.json();

    if (
      !results ||
      !results[0].series ||
      !results[0].series[0].values ||
      !results[0].series[0].values[0]
    ) {
      return null; // No data available for the specified topic
    }

    const result = results.flatMap((result) =>
      result.series?.flatMap((serie) => serie.values)
    );

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchAllTopicsFromInfluxDB = async (): Promise<string[]> => {
  try {
    // Define the query to get all unique topics from the 'mqtt_consumer' measurement
    const query = `SHOW TAG VALUES FROM "mqtt_consumer" WITH KEY = "topic"`;
    const url = `${INFLUXDB_URL}?pretty=true&db=${BUCKET}&q=${encodeURIComponent(
      query
    )}`;

    // Fetch data from the InfluxDB API
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const { results }: InfluxDBResponse = await response.json();

    // Extract topics from the response
    if (
      !results ||
      !results[0].series ||
      !results[0].series[0].values ||
      !results[0].series[0].values.length
    ) {
      return []; // No topics available
    }

    // Map over the topics and return them as a list of strings
    const topics = results[0].series[0].values.map(([header, topic]) => topic);

    return topics;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

export type Measurement = {
  influx: {
    time: string;
    value: number;
    host: string;
    topic: string;
    id: number;
  };

  metaData: {
    binSize: number;
    location: string;
    hostName: string;
  };
};
