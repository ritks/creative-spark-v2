import { Stack } from 'expo-router';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AppProvider>
  );
}
