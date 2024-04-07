import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { registerRootComponent } from "expo";
// import useBLE from './hooks/useBLE';
// import { useState } from 'react';
// import ConnectDevice from "./components/ConnectDevice";

import "./styles.css";

export default function App() {
  // const {
  //   requestPermissions,
  //   scanForPeripherals,
  //   allDevices,
  //   connectToDevice,
  //   connectedDevice,
  //   heartRate,
  //   disconnectFromDevice,
  // } = useBLE();

  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // const scanForDevices = async () => {
  //   const isPermissionsEnabled = await requestPermissions();
  //   if (isPermissionsEnabled) {
  //     scanForPeripherals();
  //   }
  // };

  // const hideModal = () => {
  //   setIsModalVisible(false);
  // };

  // const openModal = async () => {
  //   scanForDevices();
  //   setIsModalVisible(true);
  // };
  
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);