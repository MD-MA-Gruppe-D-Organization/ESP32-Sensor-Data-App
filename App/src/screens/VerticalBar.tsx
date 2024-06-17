import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust path as necessary

type VerticalBarRouteProp = RouteProp<RootStackParamList, 'VerticalBar'>;

const VerticalBar: React.FC = () => {
    const route = useRoute<VerticalBarRouteProp>();
    const percent = route.params?.percent ?? 100; // Use 100 as the default value if no param is passed

    const barHeight = `${percent}%`;

    return (
        <View style={styles.container}>
            <Svg height="100%" width="50">
                <Rect x="15" y="0" width="20" height={barHeight} fill="blue" />
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

export default VerticalBar;
