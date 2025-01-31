import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { registerRootComponent } from "expo";
// import useBLE from './hooks/useBLE';
// import { useState } from 'react';
// import ConnectDevice from "./components/ConnectDevice";

import "./styles.css";
import BluetoothSerial from 'react-native-bluetooth-serial-next';

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
  const a = async () => {
    const isEnabled = await BluetoothSerial.isEnabled();
  }
  a();
  
  return (
    <View className="h-screen w-full p-8 flex overflow-scroll dark:bg-gray-950 dark:text-gray-50">
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);