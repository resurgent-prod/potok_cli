import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import VideoScreen from './VideoScreen';
import VideoUploadScreen from './VideoUploadScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const MainAppScreen = ({ navigation }) => {
  return (
<View style={{ flex: 1 }}>
    <GestureHandlerRootView style={styles.container}>
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: 'white',
          background: 'black',
          card: 'black',
          text: 'white',
        },
      }}>
      <Tab.Navigator
        initialRouteName="Video"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Video" 
                    component={VideoScreen}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <View style={styles.iconContainer}>
                        <Image
                          source={require('./assets/home_ico.png')}
                          style={{ width: size, height: size, tintColor: color }}
                        />
                        </View>
                      ),
                      tabBarLabel: '',
                    }} />
        <Tab.Screen name="VideoUploadScreen" 
                    component={VideoUploadScreen}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <View style={styles.iconContainer}>
                        <Image
                          source={require('./assets/add_ico.png')}
                          style={{ width: size, height: size, tintColor: color }}
                        />
                        </View>
                      ),
                      tabBarLabel: '',
                    }} />
        <Tab.Screen name="Profile" 
                    component={VideoUploadScreen}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <View style={styles.iconContainer}>
                        <Image
                          source={require('./assets/profile_ico.png')}
                          style={{ width: size, height: size, tintColor: color }}
                        />
                        </View>
                      ),
                      tabBarLabel: '',
                    }} />
      </Tab.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    paddingTop: 25,
  },
});

export default MainAppScreen;
