import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust path as necessary

type HorizontalBarRouteProp = RouteProp<RootStackParamList, 'VerticalBar'>;

const HorizontalBar: React.FC = () => {
    const route = useRoute<HorizontalBarRouteProp>();
    const percent = route.params?.percent ?? 100; // Use 100 as the default value if no param is passed

    // Adjust the full bar width as needed
    const fullBarWidth = '80%';

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

    // Calculate y position for the text to center it vertically over the bar
    const textY = barPadding + barHeight / 2 + 6; // Adjusted to center text visually

    // Adjust x position to align text to the left of the bar and inside the border
    const textX = `${parseFloat(barWidth) > 10 ? xPos + 10 : xPos}%`;

    return (
        <View style={styles.container}>
            <Svg height={barHeight + 2 * barPadding} width="100%">
                {/* Filled portion */}
                <Rect x={`${xPos}%`} y={barPadding} width={barWidth} height={barHeight} fill={barColor} stroke="none" />
                {/* Full bar outline (border) */}
                <Rect x={`${xPos}%`} y={barPadding} width={fullBarWidth} height={barHeight} fill="none" stroke="black" strokeWidth="2" />
                {/* Text */}
                <Text
                    x={textX}
                    y={textY} // Position the text vertically centered over the bar
                    fontSize="18" // Increased font size for the text
                    fontWeight="bold"
                    fill="black" // Black text color
                    textAnchor="start" // Align text to the left
                >
                    Trash Sensor 1
                </Text>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HorizontalBar;
