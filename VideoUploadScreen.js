//UploadVideoScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';



const VideoUploadScreen = () => {
  const [video, setVideo] = useState(null);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Извините, нам нужны разрешения для доступа к галерее, чтобы выбрать видео.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
        if (result.assets.length > 0) {
            const selectedVideo = result.assets[0];
            setVideo(selectedVideo.uri);
            console.log('censer');
            console.log(selectedVideo.uri);
        }
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      alert('Пожалуйста, выберите видео');
      return;
    }

    const uniqueId = uuidv4();
    const videoFileName = `${uniqueId}_video.mp4`;

    const formData = new FormData();
    formData.append('video', {
      uri: video,
      type: 'video/mp4',
      name: videoFileName,
    });

    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');

    try {
      const response = await axios.post('http://46.36.152.248:3000/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: jwtToken,
          'x-app-token': appToken,

        },
      });

      if (response.status === 201) {
        alert('Видео успешно загружено');
        setVideo(null);
      }
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error, formData);
      alert('Ошибка при загрузке видео');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Загрузить видео</Text>
      <Button title="Выбрать видео" onPress={pickVideo} />
      {video && (
        <View>
          <Text>Выбрано видео: {video}</Text>
          <Button title="Загрузить видео" onPress={uploadVideo} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default VideoUploadScreen;
