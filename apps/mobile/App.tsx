import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { registerRootComponent } from "expo";
import useBLE from './hooks/useBLE';
import { useState } from 'react';
import ConnectDevice from "./components/ConnectDevice";


export default function App() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  
  return (
    <View style={{ flex: 1, justifyContent: "center",
    alignItems: "center" }}>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
      >
        <Text>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
      <ConnectDevice
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </View>
  );
}

registerRootComponent(App);