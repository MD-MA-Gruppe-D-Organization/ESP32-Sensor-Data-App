const INFLUXDB_URL = 'http://10.0.2.2:8086/query';
const DATABASE_NAME = 'iot_data';
const API_TOKEN = 'tL2p3izJB02-a9Z7p-lPzcwoyWNqGTy0KJaqzz5wxELHF232mg4nO2hPztAfTRLQQFBfUHdZUoAUPedaaMCcTQ==';

export const fetchDataFromInfluxDB = async (topic: string) => {
  try {
    const response = await fetch(`${INFLUXDB_URL}?pretty=true&db=${DATABASE_NAME}&q=SELECT * FROM "mqtt_consumer" WHERE "topic" = '${topic}'`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
