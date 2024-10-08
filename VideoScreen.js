//VideoScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VideoScreen = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null); // Создаем ref для видео
  

  useEffect(() => {
    loadRandomVideos();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          loadNextVideo();
        }
      });
    }
  }, [currentVideoIndex]);

  const loadRandomVideos = async () => {
    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://46.36.152.248:3000/random-video', {
        headers: {
            Authorization: jwtToken,
            'x-app-token': appToken,
        },
      });

      if (response.status === 200) {
        setVideos(response.data.videos);
        // Предварительно загружаем следующее видео
        loadNextVideo();
      } else {
        console.error('Ошибка при загрузке видео');
      }
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
    }
  };

  const loadNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextVideoIndex = currentVideoIndex + 1;
      Video.prefetch(videos[nextVideoIndex].videoUrl);
    }
  };

  const handleVideoEnd = async () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      if (videoRef.current) {
        videoRef.current.replayAsync(); // Запустить видео заново
      }
    }
  };


  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationY } = nativeEvent;

      if (translationY < -50) {
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(currentVideoIndex + 1);
          if (videoRef.current) {
            videoRef.current.replayAsync(); // Запустить видео заново
          }
        }
      } else if (translationY > 50) {
        if (currentVideoIndex > 0) {
          setCurrentVideoIndex(currentVideoIndex - 1);
          if (videoRef.current) {
            videoRef.current.replayAsync(); // Запустить видео заново
          }
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View style={styles.videoContainer}>
          {videos.length > 0 ? (
            <Video
              ref={videoRef}
              source={{ uri: videos[currentVideoIndex].videoUrl }}
              style={styles.video}
              onEnd={handleVideoEnd}
              resizeMode="cover"
              shouldPlay={true}
              isMuted={false}
              useNativeControls={false}
              onError={(error) => console.error('Ошибка воспроизведения видео', error)}
              onLog={(log) => console.log('log', log)}
              preload="auto"
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  video: {
    flex: 1,
  },
});

export default VideoScreen;
