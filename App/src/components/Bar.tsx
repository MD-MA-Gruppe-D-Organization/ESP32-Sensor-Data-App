import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

interface BarProps {
    percent: number;
}

const Bar: React.FC<BarProps> = ({ percent }) => {
    // Adjust the full bar width as needed
    const fullBarWidth = '90%'; // Increased card width

    // Calculate bar width based on percent
    const barWidth = `${(parseFloat(fullBarWidth) * percent) / 100}%`;

    const barHeight = 50; // Increased height for a thicker bar
    const barPadding = 10; // Padding around the bar

    // Calculate the color based on the percent
    const calculateColor = (percent: number) => {
        const r = Math.floor((255 * percent) / 100);
        const g = Math.floor((255 * (100 - percent)) / 100);
        return `rgb(${r},${g},0)`;
    };

    const barColor = calculateColor(percent);

    // Calculate x position to center the bar within the SVG
    const xPos = (100 - parseFloat(fullBarWidth)) / 2; // Centered xPos for the bar
    const textXPos = xPos + 10; // Adjusted xPos for the text

    return (
        <View style={styles.container}>
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
                {/* Text for Trash Sensor 1 */}
                <Text
                    x={`${textXPos}%`} // Adjusted x position for the text
                    y={barPadding + barHeight / 2 + 6} // Position the text vertically centered over the bar
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
        alignItems: 'center',
        justifyContent: 'flex-start', // Align content to the top
    },
});

export default Bar;
