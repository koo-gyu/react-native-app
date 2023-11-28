import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import type {
  AudioSet,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import {PermissionsAndroid, Platform} from 'react-native';
import {useRef, useState} from 'react';

function saveURIIntoStorage(uri: string) {}

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const playerRef = useRef(new AudioRecorderPlayer());

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

      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
      };

      console.log('audioSet', audioSet);

      const uri = await playerRef.current.startRecorder(
        `${RNFetchBlob.fs.dirs.DownloadDir}/hello.mp4`,
        audioSet,
      );

      playerRef.current.addRecordBackListener((e: RecordBackType) => {
        // console.log('record-back', e);
        console.log(
          e.currentPosition,
          playerRef.current.mmssss(Math.floor(e.currentPosition)),
        );
      });
      console.log(`uri: ${uri}`);

      saveURIIntoStorage(uri);
    },
    async stopRecord() {
      setIsRecording(false);

      const result = await playerRef.current.stopRecorder();
      playerRef.current.removeRecordBackListener();

      console.log(result);
    },
    get isRecording() {
      return isRecording;
    },
  };
}
