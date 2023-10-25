import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ jwtToken }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Получение профиля пользователя при монтировании компонента
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://46.36.152.248:3000/profile', {
        headers: { Authorization: jwtToken, 'x-app-token': appToken, },
      });

      if (response.status === 200) {
        setUserProfile(response.data);
      }
    } catch (error) {
      // Обработка ошибок при получении профиля
      console.error('Ошибка при получении профиля:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      {userProfile ? (
        <View style={styles.profileInfo}>
          <Text>Имя: {userProfile.Name}</Text>
          <Text>Возраст: {userProfile.Age}</Text>
          {/* Другие поля профиля */}
        </View>
      ) : (
        <Text>Загрузка профиля...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', // Изменено с 'center' на 'flex-start'
      alignItems: 'center',
      paddingTop: 20, // Добавлен верхний отступ
      backgroundColor: 'white',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    profileInfo: {
      paddingHorizontal: 20,
    },
  });

export default ProfileScreen;
