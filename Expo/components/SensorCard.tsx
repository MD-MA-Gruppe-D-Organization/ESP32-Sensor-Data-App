import { fetchAllMeasurementsToTopicFromInfluxDB, Measurement } from "@/api";
import React, { useState } from "react";
import {
  Card,
  IconButton,
  ProgressBar,
  useTheme,
  DataTable,
  List,
  Button,
  Dialog,
  Portal,
  TextInput,
  Tooltip,
  ActivityIndicator,
  Modal,
} from "react-native-paper";
import { ThemedText } from "./ThemedText";
import Storage from "react-native-storage";
import { DateTime } from "luxon";
import { ScrollView, View } from "react-native";
import LineChartComponent from "./LineChart";

interface SensorCardProps {
  measurement: Measurement | undefined;
  measurements: Measurement[] | undefined;
  handleRefresh: () => void;
  index: number;
  onEdit: (
    binSize: number | undefined,
    location: string | undefined,
    hostName: string | undefined
  ) => void;
  binSize: number | undefined;
  location: string | undefined;
  hostName: string;
  loadingRefresh: boolean;
}

const SensorCard: React.FC<SensorCardProps> = ({
  measurement,
  measurements,
  handleRefresh,
  index,
  onEdit,
  binSize,
  location,
  hostName,
  loadingRefresh,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [editedBinSize, setEditedBinSize] = useState(binSize);

  const [editedLocation, setEditedLocation] = useState(location);
  const [accordionExpanded, setAccordionExpanded] = useState(false); // New state for accordion visibility
  const handleEdit = () => {
    setVisible(true);
  };

  const handleSave = () => {
    if (editedBinSize !== undefined && editedLocation !== undefined) {
      onEdit(editedBinSize, editedLocation, measurement?.metaData.hostName);
      setVisible(false);
    } else {
      console.error("save error");
    }
  };

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
      onPress={() => setAccordionExpanded(!accordionExpanded)}
    >
      {!loadingRefresh ? (
        <>
          <Card.Content
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexDirection: "row",
              paddingTop: 16,
            }}
          >
            <ThemedText type="subtitle">
              {location ? location : measurement?.metaData.hostName}
            </ThemedText>
            <Tooltip title="current fill-level">
              <ThemedText type="subtitle">
                {(
                  normalizeValue(
                    measurement?.influx.value ?? 0,
                    measurement?.metaData.binSize
                  ) * 100
                ).toFixed(1)}
                %
              </ThemedText>
            </Tooltip>
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

            <DataTable style={{ display: accordionExpanded ? "flex" : "none" }}>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                  last measurement
                </DataTable.Cell>
                <DataTable.Cell>
                  {DateTime.fromISO(measurement?.influx.time!)
                    .setZone("Europe/Berlin")
                    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS, {
                      locale: "de-DE",
                    })}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                  host
                </DataTable.Cell>
                <DataTable.Cell>{measurement?.influx.host}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                  topic
                </DataTable.Cell>
                <DataTable.Cell>{measurement?.influx.topic}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                  bin height
                </DataTable.Cell>
                <DataTable.Cell>
                  {measurement?.metaData.binSize} cm
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
                  remaining space
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
          </Card.Content>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton icon="cog" onPress={handleEdit} />
            <IconButton
              icon="chart-bell-curve"
              onPress={() => setChartVisible(true)}
            />
          </View>
        </>
      ) : (
        <ActivityIndicator
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: 16,
          }}
          size="small"
        />
      )}

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => [setVisible(false), handleSave]}
        >
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Content style={{ display: "flex", gap: 8 }}>
            <TextInput
              label="Bin Size"
              mode="outlined"
              value={editedBinSize?.toString()}
              onChangeText={(text) => setEditedBinSize(Number(text))}
            />
            <TextInput
              label="Location"
              mode="outlined"
              value={editedLocation}
              onChangeText={(text) => setEditedLocation(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Modal
          visible={chartVisible}
          onDismiss={() => [setChartVisible(false)]}
          contentContainerStyle={{
            padding: 8,
            backgroundColor: theme.colors.background,
          }}
        >
          <ScrollView horizontal={true} centerContent={true}>
            <LineChartComponent
              topic={measurement!.influx.topic!}
            ></LineChartComponent>
          </ScrollView>
        </Modal>
      </Portal>
    </Card>
  );
};

export default SensorCard;
