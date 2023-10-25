import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainAppScreen from './MainAppScreen'; // Импортируйте экран MainAppScreen
import axios from 'axios';
import LoginRegisterScreen from './LoginRegisterScreen';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const appToken = await AsyncStorage.getItem('appToken');
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    if (appToken || jwtToken) {
      // Пользователь авторизован, проверить токен на сервере
      const tokenValid = await checkTokenOnServer(appToken); // Функция для проверки токена на сервере
  
      if (tokenValid) {
        setAuthenticated(true);
      } else {
        // Токен не прошел проверку на сервере
        setAuthenticated(false);
      }
    } else {
      // Пользователь не авторизован
      setAuthenticated(false);
    }
  }
  
  const checkTokenOnServer = async (appToken) => {
    try {
      // Отправить запрос на сервер для проверки токена
      const response = await axios.post('http://46.36.152.248:3000/check-token', { appToken });
  
      if (response.status === 200 && response.data.valid) {
        return true;
      }
    } catch (error) {
      // Обработка ошибок проверки токена на сервере
      console.error('Ошибка проверки токена на сервере:', error);
    }
  
    return false;
  }
  

  return (
    <View style={{ flex: 1 }}>
      {authenticated ? (
        <MainAppScreen />
      ) : (
        <LoginRegisterScreen />
      )}
    </View>
  );
};

export default App;
