import { Measurement } from "@/api";
import React from "react";
import {
  Card,
  IconButton,
  ProgressBar,
  useTheme,
  DataTable,
  List,
} from "react-native-paper";
import { ThemedText } from "./ThemedText";

interface SensorCardProps {
  measurement: Measurement | undefined;
  handleRefresh: () => void;
  index: number;
}

const SensorCard: React.FC<SensorCardProps> = ({
  measurement,
  handleRefresh,
  index,
}) => {
  const theme = useTheme();
  function normalizeValue(currentValue: number, maxValue = 100) {
    return currentValue / maxValue;
  }
  const progressColor = (progress: number) => {
    const r = Math.floor((255 * progress) / 100);
    const g = Math.floor((255 * (100 - progress)) / 100);
    return `rgb(${r},${g},0)`;
  };
  return (
    <Card
      key={index}
      style={{
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.shadow,
        borderColor: theme.colors.outline,
        borderWidth: 0.5,
        marginBottom: 16,
      }}
    >
      <Card.Content
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexDirection: "row",
        }}
      >
        <ThemedText type="subtitle">
          {measurement?.metaData.location}
        </ThemedText>
        <ThemedText type="subtitle">
          {(
            normalizeValue(
              measurement?.influx.value ?? 0,
              measurement?.metaData.binSize
            ) * 100
          ).toFixed(1)}
          %
        </ThemedText>
        <IconButton icon="reload" onPress={() => handleRefresh()} />
      </Card.Content>
      <Card.Content>
        <ProgressBar
          progress={normalizeValue(
            measurement?.influx.value ?? 0,
            measurement?.metaData.binSize
          )}
          color={progressColor(
            measurement?.influx.value ??
              0 *
                normalizeValue(
                  measurement?.influx.value ?? 0,
                  measurement?.metaData.binSize
                )
          )}
          style={{ marginTop: 16, height: 20, borderRadius: 8 }}
        />
        <List.Accordion
          title=""
          left={(props) => (
            <List.Icon
              {...props}
              icon="information"
              color={theme.colors.backdrop}
            />
          )}
          style={{ borderRadius: 8, marginTop: 8 }}
        >
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                Time
              </DataTable.Cell>
              <DataTable.Cell>{measurement?.influx.time}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                Host
              </DataTable.Cell>
              <DataTable.Cell>{measurement?.influx.host}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                Topic
              </DataTable.Cell>
              <DataTable.Cell>{measurement?.influx.topic}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                Bin Size
              </DataTable.Cell>
              <DataTable.Cell>
                {measurement?.metaData.binSize} cm
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                Available Space
              </DataTable.Cell>
              <DataTable.Cell>
                {(
                  100 -
                  normalizeValue(
                    measurement?.influx.value ?? 0,
                    measurement?.metaData.binSize
                  ) *
                    100
                ).toFixed(1)}
                %
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </List.Accordion>
      </Card.Content>
    </Card>
  );
};

export default SensorCard;
