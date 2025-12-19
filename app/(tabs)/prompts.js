import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { PROMPTS, LOCATIONS, GROUP_SIZES, filterPromptsByContext, getRandomPrompt } from '../../data/prompts';
import { Ionicons } from '@expo/vector-icons';

const LOCATION_OPTIONS = [
  { id: LOCATIONS.HOME, label: 'Home', icon: 'home' },
  { id: LOCATIONS.PUBLIC, label: 'Public Space', icon: 'business' },
  { id: LOCATIONS.RESTAURANT, label: 'Restaurant', icon: 'restaurant' },
  { id: LOCATIONS.OUTDOORS, label: 'Outdoors', icon: 'leaf' },
];

const GROUP_OPTIONS = [
  { id: GROUP_SIZES.SOLO, label: 'Solo' },
  { id: GROUP_SIZES.ONE, label: '1-2 people' },
  { id: GROUP_SIZES.SMALL, label: '3-4 people' },
  { id: GROUP_SIZES.LARGE, label: '5+ people' },
];

export default function PromptsScreen() {
  const router = useRouter();
  const { interests } = useApp();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedGroupSize, setSelectedGroupSize] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);

  const generatePrompt = () => {
    // Get prompts matching user's interests
    let availablePrompts = [];
    interests.forEach(interest => {
      const categoryPrompts = PROMPTS.filter(p => p.category === interest);
      availablePrompts = [...availablePrompts, ...categoryPrompts];
    });

    // Fallback to all prompts if no interests match
    if (availablePrompts.length === 0) {
      availablePrompts = PROMPTS;
    }

    // Filter by context
    const filteredPrompts = filterPromptsByContext(
      availablePrompts,
      selectedLocation,
      selectedGroupSize
    );

    if (filteredPrompts.length === 0) {
      // No prompts match the filters, show message
      setCurrentPrompt({ 
        error: true, 
        text: 'No prompts match your filters. Try adjusting your location or group size!' 
      });
      return;
    }

    // Get random prompt
    const prompt = getRandomPrompt(filteredPrompts);
    setCurrentPrompt(prompt);
  };

  const handleCompletePrompt = () => {
    if (currentPrompt && !currentPrompt.error) {
      router.push({
        pathname: '/journal/new',
        params: { promptId: currentPrompt.id, promptText: currentPrompt.text }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Get a Prompt</Text>
          <Text style={styles.subtitle}>
            Need inspiration right now? Select your context and we'll give you something creative to do!
          </Text>
        </View>

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where are you?</Text>
          <View style={styles.optionsGrid}>
            {LOCATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedLocation === option.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedLocation(
                  selectedLocation === option.id ? null : option.id
                )}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={option.icon} 
                  size={28} 
                  color={selectedLocation === option.id ? '#6366f1' : '#6b7280'} 
                />
                <Text style={[
                  styles.optionText,
                  selectedLocation === option.id && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Group Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who are you with?</Text>
          <View style={styles.optionsRow}>
            {GROUP_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.chipButton,
                  selectedGroupSize === option.id && styles.chipButtonSelected
                ]}
                onPress={() => setSelectedGroupSize(
                  selectedGroupSize === option.id ? null : option.id
                )}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  selectedGroupSize === option.id && styles.chipTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePrompt}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={24} color="#fff" />
          <Text style={styles.generateButtonText}>Generate Prompt</Text>
        </TouchableOpacity>

        {/* Current Prompt Display */}
        {currentPrompt && (
          <View style={styles.promptCard}>
            {currentPrompt.error ? (
              <View style={styles.errorState}>
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{currentPrompt.text}</Text>
              </View>
            ) : (
              <>
                <View style={styles.promptHeader}>
                  <Ionicons name="sparkles" size={28} color="#6366f1" />
                  <Text style={styles.categoryBadge}>{currentPrompt.category}</Text>
                </View>
                
                <Text style={styles.promptText}>{currentPrompt.text}</Text>

                <View style={styles.promptActions}>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleCompletePrompt}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.completeButtonText}>Complete & Journal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={generatePrompt}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={20} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  chipButtonSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  promptCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 32,
    marginBottom: 20,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 12,
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#eef2ff',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
});
