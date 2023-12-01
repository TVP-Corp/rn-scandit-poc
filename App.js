/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {DataCaptureView} from 'scandit-react-native-datacapture-core';
import useTicketScanner from './src/hooks/useTicketScanner';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App: () => Node = () => {
  const {dataCaptureContext, viewRef} = useTicketScanner();

  return (
    <SafeAreaView style={{backgroundColor: Colors.lighter}}>
      <StatusBar barStyle={'dark-content'} />
      <DataCaptureView
        style={{height: '100%', width: '100%'}}
        context={dataCaptureContext}
        ref={viewRef}
      />
    </SafeAreaView>
  );
};

export default App;
