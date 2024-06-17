import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Bar from '../components/Bar';
import ExpandableContent from '../components/ExpandableContent';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust path as necessary

type HorizontalBarRouteProp = RouteProp<RootStackParamList, 'VerticalBar'>;

const HorizontalBar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const route = useRoute<HorizontalBarRouteProp>();

    const percent = route.params?.percent ?? 100; // Use 100 as the default value if no param is passed

    // Toggle function for expanding/collapsing
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            {/* Card-like layout for the entire content */}
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={styles.card}>
                    {/* Bar Component */}
                    <Bar percent={percent} />
                    {/* ExpandableContent Component */}
                    <ExpandableContent expanded={expanded} />
                </View>
            </TouchableWithoutFeedback>
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
});

export default HorizontalBar;
