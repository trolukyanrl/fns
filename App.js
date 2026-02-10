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
import TADashboard from './screens/TADashboard';
import TasksScreen from './screens/TasksScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import LocationQRScannerScreen from './screens/LocationQRScannerScreen';
import InspectionFormScreen from './screens/InspectionFormScreen';
import SKInspectionScreen from './screens/SKInspectionScreen';
import MappingScreen from './screens/MappingScreen';
import VerifyScreen from './screens/VerifyScreen';
import PendingApprovalsScreen from './screens/PendingApprovalsScreen';
import ApprovalReviewScreen from './screens/ApprovalReviewScreen';
import ApprovalStatusScreen from './screens/ApprovalStatusScreen';
import OverdueTasksScreen from './screens/OverdueTasksScreen';

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

          {/* TA Screens */}
          <Stack.Screen name="TADashboard" component={TADashboard} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="LocationQRScanner" component={LocationQRScannerScreen} />
          <Stack.Screen name="InspectionForm" component={InspectionFormScreen} />
          <Stack.Screen name="SKInspection" component={SKInspectionScreen} />
          <Stack.Screen name="Mapping" component={MappingScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />

          {/* SIC Screens */}
          <Stack.Screen name="PendingApprovals" component={PendingApprovalsScreen} />
          <Stack.Screen name="ApprovalStatus" component={ApprovalStatusScreen} />
          <Stack.Screen name="ApprovalReview" component={ApprovalReviewScreen} />
          <Stack.Screen name="OverdueTasks" component={OverdueTasksScreen} />
        </Stack.Navigator>

        <StatusBar style="dark" />
      </NavigationContainer>
    </TaskProvider>
  );
}
