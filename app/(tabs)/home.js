import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { PROMPTS, getPromptsByCategory, getRandomPrompt } from '../../data/prompts';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { interests, dailyPrompt, lastPromptDate, updateDailyPrompt } = useApp();
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    checkAndUpdateDailyPrompt();
  }, []);

  const checkAndUpdateDailyPrompt = () => {
    const today = new Date().toDateString();
    
    // Check if it's a new day or no prompt exists
    if (!lastPromptDate || lastPromptDate !== today || !dailyPrompt) {
      generateNewDailyPrompt();
      setIsNewDay(true);
    } else {
      setIsNewDay(false);
    }
  };

  const generateNewDailyPrompt = () => {
    // Get prompts matching user's interests
    let availablePrompts = [];
    interests.forEach(interest => {
      const categoryPrompts = getPromptsByCategory(interest);
      availablePrompts = [...availablePrompts, ...categoryPrompts];
    });

    // Fallback to all prompts if no interests match
    if (availablePrompts.length === 0) {
      availablePrompts = PROMPTS;
    }

    // Select random prompt
    const newPrompt = getRandomPrompt(availablePrompts);
    updateDailyPrompt(newPrompt);
  };

  const handleCompletePrompt = () => {
    router.push({
      pathname: '/journal/new',
      params: { promptId: dailyPrompt.id, promptText: dailyPrompt.text }
    });
  };

  const handleSkipDay = () => {
    generateNewDailyPrompt();
  };

  if (!dailyPrompt) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading your daily prompt...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {isNewDay && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ New Today</Text>
            </View>
          )}
          <Text style={styles.greeting}>Your Daily Spark</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        <View style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <Ionicons name="bulb" size={32} color="#6366f1" />
            <Text style={styles.categoryBadge}>{dailyPrompt.category}</Text>
          </View>
          
          <Text style={styles.promptText}>{dailyPrompt.text}</Text>

          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.metadataText}>
                {dailyPrompt.location.join(', ')}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="people" size={16} color="#6b7280" />
              <Text style={styles.metadataText}>
                {dailyPrompt.groupSize[0]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCompletePrompt}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Complete & Journal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkipDay}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#6366f1" />
            <Text style={styles.secondaryButtonText}>Get Different Prompt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tip}>
          <Ionicons name="information-circle" size={20} color="#6366f1" />
          <Text style={styles.tipText}>
            Need a prompt right now? Check out the Prompts tab for on-demand inspiration!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6b7280',
  },
  promptCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#eef2ff',
    color: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  promptText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 34,
    marginBottom: 20,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  tip: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4f46e5',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
