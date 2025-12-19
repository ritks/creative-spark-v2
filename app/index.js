import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on onboarding status
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [hasCompletedOnboarding, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
