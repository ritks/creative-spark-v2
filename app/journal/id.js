import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function JournalDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { journalEntries, deleteJournalEntry } = useApp();

  const entry = journalEntries.find(e => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Entry not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            await deleteJournalEntry(id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Date and Visibility */}
        <View style={styles.metaSection}>
          <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
          <View style={[
            styles.visibilityBadge,
            entry.isPublic && styles.visibilityBadgePublic
          ]}>
            <Ionicons 
              name={entry.isPublic ? 'globe' : 'lock-closed'} 
              size={14} 
              color={entry.isPublic ? '#10b981' : '#6b7280'} 
            />
            <Text style={[
              styles.visibilityText,
              entry.isPublic && styles.visibilityTextPublic
            ]}>
              {entry.isPublic ? 'Public' : 'Private'}
            </Text>
          </View>
        </View>

        {/* Prompt */}
        <View style={styles.promptSection}>
          <Text style={styles.promptLabel}>Prompt</Text>
          <Text style={styles.promptText}>{entry.promptText}</Text>
        </View>

        {/* Photo */}
        {entry.photoUri && (
          <View style={styles.photoSection}>
            <Image 
              source={{ uri: entry.photoUri }} 
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Notes */}
        {entry.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Your Thoughts</Text>
            <Text style={styles.notesText}>{entry.notes}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  visibilityBadgePublic: {
    backgroundColor: '#d1fae5',
  },
  visibilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  visibilityTextPublic: {
    color: '#10b981',
  },
  promptSection: {
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 28,
  },
  photoSection: {
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  notesSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
  },
});
