import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { CATEGORIES } from '../../data/prompts';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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

export default function SettingsScreen() {
  const router = useRouter();
  const { interests, saveInterests, journalEntries } = useApp();
  const [selectedInterests, setSelectedInterests] = useState(interests);

  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert('No interests selected', 'Please select at least one interest.');
      return;
    }

    await saveInterests(selectedInterests);
    Alert.alert('Saved!', 'Your interests have been updated.');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      'This will delete all your journal entries and reset your interests. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Data Reset', 'Please restart the app.', [
              { text: 'OK', onPress: () => router.replace('/') }
            ]);
          }
        }
      ]
    );
  };

  const hasChanges = JSON.stringify(selectedInterests.sort()) !== JSON.stringify(interests.sort());

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <Text style={styles.sectionDescription}>
            Select the activities you'd like to see in your daily prompts.
          </Text>

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

          {hasChanges && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveInterests}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{journalEntries.length}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {journalEntries.filter(e => e.isPublic).length}
              </Text>
              <Text style={styles.statLabel}>Public Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {journalEntries.filter(e => !e.isPublic).length}
              </Text>
              <Text style={styles.statLabel}>Private Entries</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.appName}>Creative Spark ✨</Text>
            <Text style={styles.appDescription}>
              Daily creative prompts to help you recapture your creativity, avoid doomscrolling, 
              and do things just for the fun of it.
            </Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetData}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={20} color="#ef4444" />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  categoryCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#6366f1',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  version: {
    fontSize: 12,
    color: '#9ca3af',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  dangerButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
