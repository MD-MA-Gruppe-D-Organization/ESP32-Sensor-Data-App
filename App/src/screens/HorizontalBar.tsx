import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import Bar from '../components/Bar';
import ExpandableContent from '../components/ExpandableContent';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust path as necessary
import { Measurement } from '../services/Measurement'; // Adjust path as per your project structure
import { fetchNewestValueFromInfluxDB } from '../services/api'; // Import your API method

type HorizontalBarRouteProp = RouteProp<RootStackParamList, 'VerticalBar'>;

const HorizontalBar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [measurement, setMeasurement] = useState<Measurement | undefined>(undefined);
    const [loading, setLoading] = useState(true); // Loading state to manage API call
    const [percent, setPercent] = useState<number>(100); // State for percentage calculation

    const route = useRoute<HorizontalBarRouteProp>();

    // Toggle function for expanding/collapsing
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // Function to handle data refresh
    const handleRefresh = () => {
        setLoading(true); // Set loading state to true to show ActivityIndicator

        fetchMeasurement();
    };

    const fetchMeasurement = async () => {
        try {
            const topic = 'mdma/1481765933'; // Replace with your actual topic
            const fetchedMeasurement: Measurement | null = await fetchNewestValueFromInfluxDB(topic);
            
            if (fetchedMeasurement) {
                setMeasurement(fetchedMeasurement);

                // Calculate percentage based on measurement data
                const dataValue = fetchedMeasurement.data ?? 0;
                let calculatedPercent = 100 - dataValue; // Reverse logic: 100% if data is 0, 0% if data is 100 or more

                // Ensure percent is within valid range
                if (calculatedPercent < 0) {
                    calculatedPercent = 0; // Cap percent at 0
                } else if (calculatedPercent > 100) {
                    calculatedPercent = 100; // Cap percent at 100
                }


                setPercent(calculatedPercent);
            }
        } catch (error) {
            console.error('Error fetching measurement:', error);
        } finally {
            setLoading(false); // Update loading state regardless of success or failure
        }
    };

    useEffect(() => {
        fetchMeasurement();
    }, []); // Fetch measurement on initial render

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Card-like layout for the entire content */}
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={styles.card}>
                    {/* Bar Component */}
                    <Bar percent={percent} />
                    {/* ExpandableContent Component with measurement and expanded state */}
                    {measurement && <ExpandableContent expanded={expanded} measurement={measurement} />}
                </View>
            </TouchableWithoutFeedback>
            
            {/* Refresh button */}
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Align content to the top
    },
    card: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#dcdcdc', // Light gray background color for the card
        borderRadius: 10, // Rounded corners for the card
        borderWidth: 1, // Gray border around the card
        borderColor: '#a9a9a9', // Gray color for the border
        width: '90%', // Adjust width as needed
    },
    loadingContainer: {
        justifyContent: 'center',
    },
    refreshButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#007bff', // Bootstrap blue color
        borderRadius: 5,
    },
    refreshText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HorizontalBar;
