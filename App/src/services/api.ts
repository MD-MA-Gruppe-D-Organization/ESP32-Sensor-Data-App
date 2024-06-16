const INFLUXDB_BASE_URL = 'http://localhost:8086'; 

// Example endpoint to fetch data from a measurement using InfluxQL
const FETCH_DATA_ENDPOINT = '/query?q=SELECT * FROM your_measurement LIMIT 10';

export async function fetchDataFromInfluxDB(): Promise<any> {
  try {
    const response = await fetch(`${INFLUXDB_BASE_URL}${FETCH_DATA_ENDPOINT}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data; // Assuming JSON response; adjust as per your API response format
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow error for handling in components if needed
  }
}
