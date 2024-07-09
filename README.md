# ESP32-Sensor-Data-App - A React Native App Built with Expo 📱
This React-Native App displays filling data of trashcans.
The data is fetched from an influx-database.

## Prerequisites ⏮️

Before you begin, ensure you have installed the following:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

Follow the installation guides linked above if you haven't already installed these tools.

## Setting Up the Android Emulator 🪛

To run ESP32-Sensor-Data-App on an Android device, you'll need to set up an Android emulator. Follow these steps:

*Set up an Android Emulator with Expo Go*: [https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated).

Ensure the emulator starts successfully before proceeding to the next step.

## Starting the App with Expo 🛫

Once the Android emulator is ready, follow these steps to start ESP32-Sensor-Data-App:

1. *Clone the Repository*: Clone this repository to your local machine using

```bash
 git clone https://github.com/MD-MA-Gruppe-D-Organization/ESP32-Sensor-Data-App.git
```

2. *Navigate to the Project Directory*: Change your current directory to the cloned repository using `cd Expo`.

3. *Install Dependencies*: Run `npm install` to install all necessary dependencies.

4. *Start the Project*: Execute `npm run android`.

The app should now load on your Android emulator!

## Related Projects 🔗

Check out the companion app repository: 

- **[https://github.com/MD-MA-Gruppe-D-Organization/ESP32-Sensor-Communication](https://github.com/MD-MA-Gruppe-D-Organization/ESP32-Sensor-Communication)**: This repository provides a setup for communicating with an ESP32 microcontroller equipped with WiFi and an HC-SR04 Ultrasonic Sensor. It uses Docker for running a local MQTT broker and includes scripts for flashing the ESP32.

**❗This repository is crucial for the operation of ESP32-Sensor-Data-App❗**

For detailed instructions on how to deploy and configure the MQTT broker and the esp32, please visit the project's [documentation](https://github.com/MD-MA-Gruppe-D-Organization/ESP32-Sensor-Communication/blob/dev/README.md).


### Contributors 👥

- [Julian Ertle](https://github.com/julianertle)
- [Nick Mittmann](https://github.com/Nick020401)
- [Felix Kuhbier](https://github.com/FelixAlexK)
