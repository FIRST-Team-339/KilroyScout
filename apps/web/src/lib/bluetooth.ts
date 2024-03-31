/// <reference types="web-bluetooth" />

export async function search(bluetooth: typeof navigator.bluetooth) {
  console.log(
    await bluetooth.requestDevice({
      acceptAllDevices: true,
    })
  );
}
