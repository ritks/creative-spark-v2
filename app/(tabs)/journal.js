import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function JournalScreen() {
  const router = useRouter();
  const { journalEntries } = useApp();
  const [filter, setFilter] = useState('all'); // 'all', 'public', 'private'

  const filteredEntries = journalEntries.filter(entry => {
    if (filter === 'all') return true;
    return entry.isPublic === (filter === 'public');
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEntryPress = (entryId) => {
    router.push(`/journal/${entryId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({journalEntries.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'private' && styles.filterTabActive]}
            onPress={() => setFilter('private')}
          >
            <Text style={[styles.filterText, filter === 'private' && styles.filterTextActive]}>
              Private ({journalEntries.filter(e => !e.isPublic).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'public' && styles.filterTabActive]}
            onPress={() => setFilter('public')}
          >
            <Text style={[styles.filterText, filter === 'public' && styles.filterTextActive]}>
              Public ({journalEntries.filter(e => e.isPublic).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No journal entries yet</Text>
            <Text style={styles.emptyText}>
              Complete a prompt to create your first entry!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/home')}
            >
              <Text style={styles.emptyButtonText}>View Today's Prompt</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => handleEntryPress(entry.id)}
              activeOpacity={0.7}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryDate}>{formatDate(entry.createdAt)}</Text>
                  <View style={styles.visibilityBadge}>
                    <Ionicons 
                      name={entry.isPublic ? 'globe' : 'lock-closed'} 
                      size={12} 
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
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>

              <Text style={styles.promptText} numberOfLines={2}>
                {entry.promptText}
              </Text>

              {entry.notes && (
                <Text style={styles.notesPreview} numberOfLines={3}>
                  {entry.notes}
                </Text>
              )}

              {entry.photoUri && (
                <Image 
                  source={{ uri: entry.photoUri }} 
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#eef2ff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  visibilityTextPublic: {
    color: '#10b981',
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 22,
  },
  notesPreview: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
