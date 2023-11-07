import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainAppScreen from './MainAppScreen'; // Ваш основной экран после авторизации

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://213.232.196.73:3000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        // Успешный вход. Сохраните JWT токен в AsyncStorage.
        await AsyncStorage.setItem('jwtToken', token);
        setAuthenticated(true);
      }
    } catch (error) {
      // Обработка ошибок при входе.
      console.error('Ошибка при входе:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {authenticated ? (
        <MainAppScreen />
      ) : (
        <>
      <Text>Вход</Text>
      <TextInput
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
      </>
      )}
    </View>
  );
};

export default LoginScreen;