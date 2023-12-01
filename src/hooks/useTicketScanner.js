// @flow
import {useRef, useEffect, useState} from 'react';
import {AppState, BackHandler} from 'react-native';
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureOverlayStyle,
  BarcodeCaptureSession,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription,
} from 'scandit-react-native-datacapture-barcode';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';
import {requestCameraPermissionsIfNeeded} from '../utils/permissions/camera-permission-handler';

export default function useTicketScanner() {
  const viewRef = useRef<DataCaptureView>(null);

  const dataCaptureContext =
    DataCaptureContext.forLicenseKey(/*reserved_for_key*/);

  const [camera, setCamera] = useState<Camera | null>(Camera.default);
  const [barcodeCaptureMode, setBarcodeCaptureMode] =
    useState<BarcodeCapture | null>(null);
  const [isBarcodeCaptureEnabled, setIsBarcodeCaptureEnabled] = useState(false);
  const [cameraState, setCameraState] = useState(FrameSourceState.Off);

  const lastCommand = useRef<string | null>(null);

  const startCamera = () => {
    setCameraState(FrameSourceState.On);
  };

  const stopCamera = () => {
    if (camera) {
      setCameraState(FrameSourceState.Off);
    }
  };

  const startCapture = async () => {
    if (lastCommand.current === 'startCapture') {
      return;
    }
    lastCommand.current = 'startCapture';
    startCamera();
    setIsBarcodeCaptureEnabled(true);
  };

  const stopCapture = () => {
    if (lastCommand.current === 'stopCapture') {
      return;
    }
    lastCommand.current = 'stopCapture';
    setIsBarcodeCaptureEnabled(false);
    stopCamera();
  };

  const setupScanning = () => {
    const cameraSettings = new CameraSettings();
    cameraSettings.preferredResolution = VideoResolution.FullHD;
    camera?.applySettings(cameraSettings);

    dataCaptureContext.setFrameSource(camera);
    setCamera(camera);

    const settings = new BarcodeCaptureSettings();
    settings.enableSymbologies([Symbology.PDF417]);

    const barcodeCapture = BarcodeCapture.forContext(
      dataCaptureContext,
      settings,
    );

    const barcodeCaptureListener = {
      didScan: (_: BarcodeCapture, session: BarcodeCaptureSession) => {
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SymbologyDescription(barcode.symbology);

        setIsBarcodeCaptureEnabled(false);

        const scannedOutcome = {
          data: barcode.data,
          symbology,
        };

        // dispatch action for scannedOutcome
      },
    };

    barcodeCapture.addListener(barcodeCaptureListener);

    const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
      barcodeCapture,
      null,
      BarcodeCaptureOverlayStyle.Frame,
    );
    overlay.viewfinder = new RectangularViewfinder(
      RectangularViewfinderStyle.Square,
      RectangularViewfinderLineStyle.Light,
    );
    viewRef.current?.addOverlay(overlay);
    setBarcodeCaptureMode(barcodeCapture);
  };

  const handleAppStateChange = nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture();
    } else {
      requestCameraPermissionsIfNeeded()
        .then(startCapture)
        .catch(() => BackHandler.exitApp());
    }
  };

  useEffect(() => {
    const handleAppStateChangeSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    setupScanning();
    startCapture();
    return () => {
      handleAppStateChangeSubscription.remove();
      stopCapture();
      dataCaptureContext.dispose();
    };
  }, []);

  useEffect(() => {
    if (camera) {
      camera.switchToDesiredState(cameraState);
    }
  }, [cameraState]);

  useEffect(() => {
    if (barcodeCaptureMode) {
      barcodeCaptureMode.isEnabled = isBarcodeCaptureEnabled;
    }
  }, [isBarcodeCaptureEnabled]);

  return {dataCaptureContext, viewRef};
}
