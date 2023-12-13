import RNFetchBlob from 'rn-fetch-blob';

import {PermissionsAndroid, Platform} from 'react-native';
import {useRef, useState} from 'react';

function saveURIIntoStorage(uri: string) {}

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  // const playerRef = useRef(new AudioRecorderPlayer());

  return {
    async processPermission() {
      // TODO ios는 나중에,,, 현재 안드로이드 전용
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          console.log('write external stroage', grants);

          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('permissions granted');
          } else {
            console.log('All required permissions not granted');

            return;
          }
        } catch (err) {
          console.warn(err);

          return;
        }
      }
    },
    async startRecord() {
      setIsRecording(true);
    },
    async stopRecord() {
      setIsRecording(false);
    },
    get isRecording() {
      return isRecording;
    },
  };
}
