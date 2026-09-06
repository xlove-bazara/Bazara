import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InboxScreen from './src/screens/InboxScreen';
import ChatScreen from './src/screens/ChatScreen';
import CustomerDetailScreen from './src/screens/CustomerDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#090A0F',
          borderBottomWidth: 1,
          borderBottomColor: '#1E293B',
          elevation: 0,
          shadowOpacity: 0
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: 18
        },
        tabBarStyle: {
          backgroundColor: '#090A0F',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          height: 56,
          paddingBottom: 6,
          paddingTop: 6
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inbox') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Tab
        name="Inbox"
        component={InboxScreen}
        options={{ title: 'WhatsApp CRM' }}
      />
      <Tab.Tab
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#090A0F" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#090A0F'
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route, navigation }) => ({
            title: route.params?.customer?.name || 'Customer Chat',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('CustomerDetail', route.params)}
                style={{ marginRight: 8 }}
              >
                <Ionicons name="person-circle-outline" size={26} color="#10B981" />
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ title: 'Customer Profile & Notes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
