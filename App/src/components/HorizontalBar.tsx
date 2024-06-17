// HorizontalBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

interface HorizontalBarProps {
  value: number;
  maxValue: number;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ value, maxValue }) => {
  const getColor = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage <= 50) {
      return `rgb(0, ${Math.floor((255 * percentage) / 50)}, 0)`;
    } else {
      return `rgb(${Math.floor((255 * (percentage - 50)) / 50)}, ${Math.floor((255 * (100 - percentage)) / 50)}, 0)`;
    }
  };

  const barWidth = (value / maxValue) * 100;

  return (
    <View style={styles.container}>
      <Svg height="20" width="100%">
        <Rect
          x="0"
          y="0"
          width={`${barWidth}%`}
          height="20"
          fill={getColor(value, maxValue)}
        />
        <Rect
          x={`${barWidth}%`}
          y="0"
          width={`${100 - barWidth}%`}
          height="20"
          fill="#ddd"
        />
      </Svg>
      <Text style={styles.text}>{`${value} / ${maxValue}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default HorizontalBar;
