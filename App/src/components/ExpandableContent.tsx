import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Text } from 'react-native-svg';

interface ExpandableContentProps {
    expanded: boolean;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({ expanded }) => {
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
                {/* First row */}
                <Text x="25%" y="25%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                    Hello World 1
                </Text>
                <Text x="75%" y="25%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                    Hello World 2
                </Text>
                {/* Second row */}
                <Text x="25%" y="75%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                    Hello World 3
                </Text>
                <Text x="75%" y="75%" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">
                    Hello World 4
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
