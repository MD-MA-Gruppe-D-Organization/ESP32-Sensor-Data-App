const INFLUXDB_URL = "http://10.0.2.2:8086/query"; // When you run the project on an Android device, localhost is pointing to ur computer instead of the Android device so I changed http://localhost:3030 to http://10.0.2.2:3030
const BUCKET = "iot_data";
const API_TOKEN = "32z3zkGLMX-4YhM8wEYvOFLncb30L7QBayPqmj9UYHU1hqNNkQwgpmhDJkUhdDUHHImoGFNCvZbJRciePGtO3g==";

interface InfluxDBResponse {
  results: {
    series?: [
      {
        name: string;
        columns: string[];
        values: [string, string][];  // Array of arrays where each inner array contains a topic header and a topic string
      }
    ];
  }[];
}


// export const fetchLastMinutesFromInfluxDB = async (
//   topic: string,
//   minutes: number
// ): Promise<Measurement[]> => {
//   try {
//     // Calculate the time threshold for the last 'minutes'
//     const now = new Date();
//     const startTime = new Date(now.getTime() - minutes * 60000).toISOString(); // Convert minutes to milliseconds

//     const query = `SELECT * FROM "mqtt_consumer" WHERE "topic" = '${topic}' AND time > '${startTime}'`;

//     const response = await fetch(
//       `${INFLUXDB_URL}?pretty=true&db=${DATABASE_NAME}&q=${encodeURIComponent(
//         query
//       )}`,
//       {
//         headers: {
//           Authorization: `Token ${API_TOKEN}`,
//           Accept: "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (
//       !data.results ||
//       !data.results[0].series ||
//       !data.results[0].series[0].values
//     ) {
//       throw new Error(
//         "No data available for the specified topic and time range."
//       );
//     }

//     const values = data.results[0].series[0].values;
//     const measurementList: Measurement[] = [];

//     for (let i = 0; i < values.length; i++) {
//       const valueArray = values[i];
//       const value = valueArray[1];
//       const time = valueArray[0];
//       const host = valueArray[2];
//       const topic = valueArray[3];

//       const measurement = new Measurement(time, value, host, topic);
//       measurementList.push(measurement);
//     }

//     return measurementList;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

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
    )}`;

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
      metaData: { binSize: binSize, location: location ?? "-", hostName: hostName ?? "-"},
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchAllTopicsFromInfluxDB = async (): Promise<string[]> => {
  try {
    // Define the query to get all unique topics from the 'mqtt_consumer' measurement
    const query = `SHOW TAG VALUES FROM "mqtt_consumer" WITH KEY = "topic"`;
    const url = `${INFLUXDB_URL}?pretty=true&db=${BUCKET}&q=${encodeURIComponent(query)}`;

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
    const topics = results[0].series[0].values.map(([header, topic]) => topic)

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
