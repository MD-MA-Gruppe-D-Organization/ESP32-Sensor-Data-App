import { Measurement } from './Measurement';
const INFLUXDB_URL = 'http://10.0.2.2:8086/query'; // When you run the project on an Android device, localhost is pointing to ur computer instead of the Android device so I changed http://localhost:3030 to http://10.0.2.2:3030
const DATABASE_NAME = 'iot_data';
const API_TOKEN = 'tL2p3izJB02-a9Z7p-lPzcwoyWNqGTy0KJaqzz5wxELHF232mg4nO2hPztAfTRLQQFBfUHdZUoAUPedaaMCcTQ==';

export const fetchDataFromInfluxDB = async (topic: string, minutes: number): Promise<Measurement[]> => {
  try {
    // Calculate the time threshold for the last 'minutes'
    const now = new Date();
    const startTime = new Date(now.getTime() - minutes * 60000).toISOString(); // Convert minutes to milliseconds

    const query = `SELECT * FROM "mqtt_consumer" WHERE "topic" = '${topic}' AND time > '${startTime}'`;

    const response = await fetch(`${INFLUXDB_URL}?pretty=true&db=${DATABASE_NAME}&q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !data.results[0].series || !data.results[0].series[0].values) {
      throw new Error('No data available for the specified topic and time range.');
    }

    const values = data.results[0].series[0].values;
    const measurementList: Measurement[] = [];

    for (let i = 0; i < values.length; i++) {
      const valueArray = values[i];
      const value = valueArray[1];
      const time = valueArray[0];
      const host = valueArray[2];
      const topic = valueArray[3];

      const measurement = new Measurement(time, value, host, topic);
      measurementList.push(measurement);
    }

    return measurementList;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};