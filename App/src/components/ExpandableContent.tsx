import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Text } from 'react-native-svg';
import { Measurement } from '../services/Measurement'; // Adjust the path as per your project structure

interface ExpandableContentProps {
    expanded: boolean;
    measurement?: Measurement; // Accepts Measurement instance as optional prop
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({ expanded, measurement }) => {
    const expandAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(expandAnim, {
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [expanded]);

    const expandableHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // Adjust maximum height of the expandable content
    });

    const expandableOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const displayValue = (value: any) => {
        return value !== undefined && value !== null ? value : 'undefined';
    };

    const formatTime = (time: string) => {
        const date = new Date(time);
        const formattedDate = date.toLocaleDateString('en-GB'); // European date format (DD/MM/YYYY)
        const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); // Time with seconds
        return `${formattedDate} ${formattedTime}`;
    };

    if (!measurement) {
        return (
            <Animated.View
                style={[
                    styles.expandableContent,
                    {
                        height: expandableHeight,
                        opacity: expandableOpacity,
                    },
                ]}
            >
                <Svg height={200} width="100%">
                    <Text x="5%" y="50%" fontSize="16" fontWeight="bold" fill="black" textAnchor="start">
                        Measurement Data Undefined
                    </Text>
                </Svg>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            style={[
                styles.expandableContent,
                {
                    height: expandableHeight,
                    opacity: expandableOpacity,
                },
            ]}
        >
            <Svg height={200} width="100%">
                {/* Time */}
                <Text x="5%" y="20%" fontSize="16" fontWeight="bold" fill="black" textAnchor="start">
                    Time:
                </Text>
                <Text x="25%" y="20%" fontSize="16" fill="black" textAnchor="start">
                    {displayValue(formatTime(measurement.time))}
                </Text>

                {/* Host */}
                <Text x="5%" y="35%" fontSize="16" fontWeight="bold" fill="black" textAnchor="start">
                    Host:
                </Text>
                <Text x="25%" y="35%" fontSize="16" fill="black" textAnchor="start">
                    {displayValue(measurement.host)}
                </Text>

                {/* Topic */}
                <Text x="5%" y="50%" fontSize="16" fontWeight="bold" fill="black" textAnchor="start">
                    Topic:
                </Text>
                <Text x="25%" y="50%" fontSize="16" fill="black" textAnchor="start">
                    {displayValue(measurement.topic)}
                </Text>

                {/* Level */}
                <Text x="5%" y="65%" fontSize="16" fontWeight="bold" fill="black" textAnchor="start">
                    Level:
                </Text>
                <Text x="25%" y="65%" fontSize="16" fill="black" textAnchor="start">
                    {displayValue(measurement.data)} cm
                </Text>
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    expandableContent: {
        overflow: 'hidden',
        marginTop: 5,
        marginLeft: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        position: 'relative',
    },
});

export default ExpandableContent;
