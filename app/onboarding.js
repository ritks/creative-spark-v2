import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { CATEGORIES } from '../data/prompts';

const CATEGORY_OPTIONS = [
  { id: CATEGORIES.ART, label: 'Art & Drawing', emoji: '🎨' },
  { id: CATEGORIES.PHOTOGRAPHY, label: 'Photography', emoji: '📸' },
  { id: CATEGORIES.NATURE, label: 'Nature', emoji: '🌿' },
  { id: CATEGORIES.FOOD, label: 'Food', emoji: '🍽️' },
  { id: CATEGORIES.SPORTS, label: 'Sports & Movement', emoji: '⚽' },
  { id: CATEGORIES.WRITING, label: 'Writing', emoji: '✍️' },
  { id: CATEGORIES.MUSIC, label: 'Music', emoji: '🎵' },
  { id: CATEGORIES.CRAFT, label: 'Crafts', emoji: '✂️' },
];

export default function Onboarding() {
  const router = useRouter();
  const { saveInterests, completeOnboarding } = useApp();
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    await saveInterests(selectedInterests);
    await completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Creative Spark! ✨</Text>
          <Text style={styles.subtitle}>
            Select the activities you'd like to explore. We'll use this to personalize your daily prompts.
          </Text>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORY_OPTIONS.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedInterests.includes(category.id) && styles.categoryCardSelected
              ]}
              onPress={() => toggleInterest(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedInterests.includes(category.id) && styles.categoryLabelSelected
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedInterests.length === 0 && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue ({selectedInterests.length} selected)
          </Text>
        </TouchableOpacity>
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
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#6366f1',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
