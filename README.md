# React Native - Scandit PoC

## Prerequisites

You need a complete Platform Native development environment setup. This basically means that you already need to have,

- Latest [Android Studio](https://developer.android.com/studio/)
- Java v11
- Node v16.19.0

_Note: Python v2.7 may be required_

### Installation

* Clone the repository,

```sh
git clone git@github.com:TVP-Corp/rn-scandit-poc.git && cd rn-scandit-poc
```

* Go to the root folder of this repo and run command:

```sh
rn-scandit-poc$> yarn install:full
``` 

### Running the Application

#### Running on Android emulator

Make sure you have created an Android Emulator via AVD Manager through Android Studio. Launch the emulator and wait for it to boot to the home screen of the Android OS.

You can now run the app in emulator via,

```sh
rn-scandit-poc$> yarn android
```
This will build for Android and launch the app on the Android emulator.

Please note when you're running the app to android emulator and you point to local environment you will also need to run the following command

```sh
$> adb reverse tcp:9900 tcp:9900
```
#### Running on Android device

In order to build the app on a physical device you first need to connect the device to your machine and have no other Android emulators running. You will also need to enable the developer options on your Android phone, and then enable the `USB debugging` and `Install via USB` options.
```sh
rn-scandit-poc$> yarn android
```
This will build for Android and launch the app on the Android phone connected to your machine, pointing to the environment that was set before.

## Generating a signed APK for release distribution (android only)

On Android you can generate a signed Android APK which can then be distributed on different channels or installed directly on an Android device using the `adb install` command.

To do this you can run,

```sh
$> yarn android:apk
```

This will generate a signed .APK on the default Build/Outputs folder within the `/android/build` folder.
