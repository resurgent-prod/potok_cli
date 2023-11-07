import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

const ProfileScreen = ({ jwtToken }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Получение профиля пользователя при монтировании компонента
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    let username; // Переменная для хранения username

    try {
      const response = await axios.get('http://213.232.196.73:3000/profile', {
        headers: { Authorization: jwtToken, 'x-app-token': appToken },
      });

      if (response.status === 200) {
        const userData = response.data;
        username = userData.username; // Получите username из ответа на запрос профиля
        setUserProfile(userData);
      }
    } catch (error) {
      // Обработка ошибок при получении профиля
      console.error('Ошибка при получении профиля:', error);
    }

    if (username) {
      // Если username был получен, вызовите функцию для загрузки видео пользователя
      fetchUserVideos(username);
    }
  };

  const fetchUserVideos = async (username) => {
    try {
      const response = await axios.get(`http://213.232.196.73:3000/user/${username}/videos`);
      if (response.status === 200) {
        setUserVideos(response.data);
      }
    } catch (error) {
      // Обработка ошибок при получении видео пользователя
      console.error('Ошибка при получении видео пользователя:', error);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const onRefresh = async () => {
    // Переменная для хранения username
    let username;

    try {
      // Получение профиля пользователя с последним известным username
      const appToken = await AsyncStorage.getItem('appToken');
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get('http://213.232.196.73:3000/profile', {
        headers: { Authorization: jwtToken, 'x-app-token': appToken },
      });

      if (response.status === 200) {
        const userData = response.data;
        username = userData.username;
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }

    if (username) {
      try {
        // Обновление видео с использованием последнего известного username
        const response = await axios.get(`http://213.232.196.73:3000/user/${username}/videos`);
        setUserVideos(response.data);
      } catch (error) {
        console.error('Ошибка при обновлении видео:', error);
      }
    }
    setRefreshing(false);
  };

  // Остальной код вашего компонента остается неизменным

  return (
    <View style={styles.container} >
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
        <ScrollView contentContainerStyle={styles.videoContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }> 
          {userVideos.map((video, index) => (
            <Video
              key={index}
              source={{ uri: `http://213.232.196.73:3000/videos/${video.filename}` }}
              style={{ width: screenWidth / 3, height: (screenWidth / 1) * (9 / 15.2) }} // Рассчитываем ширину видео
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
    paddingTop: 100,
  },
});

export default ProfileScreen;
