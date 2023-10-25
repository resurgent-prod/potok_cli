import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MainAppScreen from './MainAppScreen'; // Ваш основной экран после авторизации

const LoginRegisterScreen = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const role = 'user'; // Установите роль по умолчанию как 'user'
  const [name, setName] = useState(''); // Имя пользователя при регистрации
  const [age, setAge] = useState(''); // Возраст пользователя при регистрации
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://46.36.152.248:3000/login', {
        username: loginUsername,
        password: loginPassword,
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

  const handleRegister = async () => {
    try {
      // Создайте объект профиля с именем и возрастом пользователя
      const profile = {
        Name: name,
        Age: age,
      };

      const response = await axios.post('http://46.36.152.248:3000/register-user', {
        username: registerUsername,
        password: registerPassword,
        role,
        profile,
      });

      if (response.status === 201) {
        const appToken = response.data.appToken;
        // Успешная регистрация. Сохраните токен приложения в AsyncStorage.
        console.log(appToken);
        await AsyncStorage.setItem('appToken', appToken);
      }
    } catch (error) {
      // Обработка ошибок при регистрации.
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {authenticated ? (
        <MainAppScreen />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Вход</Text>
          <TextInput
            placeholder="Имя пользователя"
            value={loginUsername}
            onChangeText={setLoginUsername}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
          <Button title="Войти" onPress={handleLogin} />
          
          <Text>Регистрация</Text>
          <TextInput
            placeholder="Имя пользователя"
            value={registerUsername}
            onChangeText={setRegisterUsername}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={registerPassword}
            onChangeText={setRegisterPassword}
          />
          <TextInput
            placeholder="Имя"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Возраст"
            value={age}
            onChangeText={setAge}
          />
          <Button title="Зарегистрироваться" onPress={handleRegister} />
        </View>
      )}
    </View>
  );
};

export default LoginRegisterScreen;