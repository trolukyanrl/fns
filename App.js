import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskProvider } from './TaskContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import SICDashboard from './screens/SICDashboard';
import SICTasks from './screens/SICTasks';
import SICAssignTask from './screens/SICAssignTask';
import SICProfile from './screens/SICProfile';
import TADashboard from './screens/TADashboard';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import LocationQRScannerScreen from './screens/LocationQRScannerScreen';
import InspectionFormScreen from './screens/InspectionFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Login */}
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* SIC Screens */}
          <Stack.Screen name="SICDashboard" component={SICDashboard} />
          <Stack.Screen name="SICTasks" component={SICTasks} />
          <Stack.Screen name="SICAssignTask" component={SICAssignTask} />
          <Stack.Screen name="SICProfile" component={SICProfile} />

          {/* TA Screens */}
          <Stack.Screen name="TADashboard" component={TADashboard} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="LocationQRScanner" component={LocationQRScannerScreen} />
          <Stack.Screen name="InspectionForm" component={InspectionFormScreen} />
        </Stack.Navigator>

        <StatusBar style="dark" />
      </NavigationContainer>
    </TaskProvider>
  );
}
