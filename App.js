/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback} from 'react';
import type {Node} from 'react';
import {StyleSheet, SafeAreaView, StatusBar, Text, View} from 'react-native';
import {DataCaptureView} from 'scandit-react-native-datacapture-core';
import useTicketScanner from './src/hooks/useTicketScanner';
import {horizontalScale} from './src/styles';

const App: () => Node = () => {
  const {dataCaptureContext, viewRef, barcodeViewStr} = useTicketScanner();

  const renderComponent = useCallback(() => {
    if (barcodeViewStr) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{barcodeViewStr}</Text>
        </View>
      );
    }

    return (
      <DataCaptureView
        style={styles.camera}
        context={dataCaptureContext}
        ref={viewRef}
      />
    );
  }, [barcodeViewStr]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />
      {renderComponent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: horizontalScale(25),
    backgroundColor: '#eaeaea',
  },
  title: {
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
});

export default App;
