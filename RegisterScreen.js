import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const role = 'user'; // Установите роль по умолчанию как 'user'
  const [name, setName] = useState(''); // Имя пользователя
  const [age, setAge] = useState(''); // Возраст пользователя

  const handleRegister = async () => {
    try {
      // Создайте объект профиля с именем и возрастом пользователя
      const profile = {
        Name,
        Age,
      };

      const response = await axios.post('http://213.232.196.73:3000/register-user', {
        username,
        password,
        role,
        profile,
      });

      if (response.status === 201) {
        const appToken = response.data.appToken;
        // Успешная регистрация. Сохраните токен приложения в AsyncStorage.
        console.log(appToken);
        await AsyncStorage.setItem('appToken', appToken);

        // Перенаправьте пользователя на другой экран, например, главный экран приложения.
      }
    } catch (error) {
      // Обработка ошибок при регистрации.
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Регистрация</Text>
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
  );
};

export default RegisterScreen;
