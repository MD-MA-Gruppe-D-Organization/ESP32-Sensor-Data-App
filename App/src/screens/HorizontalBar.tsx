import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust path as necessary

type HorizontalBarRouteProp = RouteProp<RootStackParamList, 'VerticalBar'>;

const HorizontalBar: React.FC = () => {
    const route = useRoute<HorizontalBarRouteProp>();
    const percent = route.params?.percent ?? 100; // Use 100 as the default value if no param is passed

    // Adjust the full bar width as needed
    const fullBarWidth = '90%'; // Increased card width

    // Calculate bar width based on percent
    const barWidth = `${(parseFloat(fullBarWidth) * percent) / 100}%`;

    const barHeight = 40; // Increased height for a thicker bar
    const barPadding = 10; // Padding around the bar

    // Calculate the color based on the percent
    const calculateColor = (percent: number) => {
        const r = Math.floor((255 * percent) / 100);
        const g = Math.floor((255 * (100 - percent)) / 100);
        return `rgb(${r},${g},0)`;
    };

    const barColor = calculateColor(percent);

    // Calculate x position to center the bar within the SVG
    const xPos = (100 - parseFloat(fullBarWidth)) / 2;

    // State for managing expansion
    const [expanded, setExpanded] = useState(false);

    // Animated value for controlling expand/collapse animation
    const expandAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    // Toggle function for expanding/collapsing
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // Effect to animate the expand/collapse action
    useEffect(() => {
        Animated.timing(expandAnim, {
            toValue: expanded ? 1 : 0,
            duration: 300, // Adjust animation duration as needed
            useNativeDriver: false, // 'false' because 'height' is not supported by native driver
        }).start();
    }, [expanded]);

    // Interpolated height for the expandable content
    const expandableHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100], // Adjust the maximum height of the expandable content
    });

    // Adjust x position to align text to the left of the bar and inside the border
    const textX = `${parseFloat(barWidth) > 10 ? xPos + 10 : xPos}%`;

    // Initial opacity for the expandable content
    const expandableOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1], // Start fully transparent
    });

    return (
        <View style={styles.container}>
            {/* Card-like layout for the entire content */}
            <TouchableWithoutFeedback onPress={toggleExpansion}>
                <View style={styles.card}>
                    <Svg height={barHeight + 2 * barPadding} width="100%">
                        {/* Filled portion with rounded corners */}
                        <Rect
                            x={`${xPos}%`}
                            y={barPadding}
                            width={barWidth}
                            height={barHeight}
                            rx={barHeight / 4} // Rounded corners for the bar
                            fill={barColor}
                            stroke="none"
                        />
                        {/* Full bar outline (border) with rounded corners */}
                        <Rect
                            x={`${xPos}%`}
                            y={barPadding}
                            width={fullBarWidth}
                            height={barHeight}
                            rx={barHeight / 4} // Rounded corners for the border
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                        />
                        {/* Text */}
                        <Text
                            x={textX}
                            y={barPadding + barHeight / 2 + 6} // Position the text vertically centered over the bar
                            fontSize="18" // Increased font size for the text
                            fontWeight="bold"
                            fill="black" // Black text color
                            textAnchor="start" // Align text to the left
                        >
                            Trash Sensor 1
                        </Text>
                    </Svg>
                    {/* Expandable section */}
                    <Animated.View
                        style={[
                            styles.expandableContent,
                            {
                                height: expandableHeight,
                                opacity: expandableOpacity,
                            },
                        ]}
                    >
                        <Svg height={50} width="100%">
                            <Text x="50%" y="25%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                                Hello World
                            </Text>
                            <Text x="50%" y="75%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                                Hello World 2
                            </Text>
                        </Svg>
                    </Animated.View>
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
    expandableContent: {
        overflow: 'hidden', // Ensure content is clipped when collapsed
        marginTop: 5, // Adjusted margin top to start higher
        padding: 10,
        backgroundColor: 'white', // White background color for the expandable content
        borderRadius: 5,
    },
});

export default HorizontalBar;
