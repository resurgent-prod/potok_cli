import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

const ProfileScreen = ({ jwtToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  
  useEffect(() => {
    // Получение профиля пользователя при монтировании компонента
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://46.36.152.248:3000/profile', {
        headers: { Authorization: jwtToken, 'x-app-token': appToken },
      });

      if (response.status === 200) {
        const userData = response.data;
        const username = userData.username; // Получите username из ответа на запрос профиля
        setUserProfile(userData);
        // После успешной загрузки профиля, вызовите функцию для загрузки видео пользователя
        fetchUserVideos(username); // Передайте имя пользователя
      }
    } catch (error) {
      // Обработка ошибок при получении профиля
      console.error('Ошибка при получении профиля:', error);
    }
  };

  const fetchUserVideos = async (username) => {
    try {
      const response = await axios.get(`http://46.36.152.248:3000/user/${username}/videos`);
      if (response.status === 200) {
        setUserVideos(response.data);
        console.log(response.data);
      }
    } catch (error) {
      // Обработка ошибок при получении видео пользователя
      console.error('Ошибка при получении видео пользователя:', error);
    }
  };

  const screenWidth = Dimensions.get('window').width; // Получаем ширину экрана

  return (
    <View style={styles.container}>
      {userProfile ? (
        <View style={styles.profileInfo}>
          <Text>Имя: {userProfile.profile.Name}</Text>
          <Text>Возраст: {userProfile.profile.Age}</Text>
          {/* Другие поля профиля */}
        </View>
      ) : (
        <Text>Загрузка профиля...</Text>
      )}
      {userVideos.length > 0 ? (
        <ScrollView contentContainerStyle={styles.videoContainer}>
          {userVideos.map((video, index) => (
            <Video
              key={index}
              source={{ uri: `http://46.36.152.248:3000/videos/${video.filename}` }}
              style={{ width: screenWidth / 2, height: (screenWidth / 0.6) * (9 / 16) }} // Рассчитываем ширину видео
              shouldPlay={false}
              isMuted={false}
              useNativeControls={false}
            />
          ))}
        </ScrollView>
      ) : (
        <Text>Нет загруженных видео</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: 'white',
  },
  profileInfo: {
    paddingHorizontal: 20,
  },
  videoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
