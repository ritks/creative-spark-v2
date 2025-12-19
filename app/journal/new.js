import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function NewJournalEntry() {
  const router = useRouter();
  const { promptId, promptText } = useLocalSearchParams();
  const { addJournalEntry } = useApp();
  
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to add images.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access to take photos.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!notes.trim() && !photoUri) {
      Alert.alert('Empty entry', 'Please add some notes or a photo before saving.');
      return;
    }

    const entry = {
      promptId,
      promptText,
      notes: notes.trim(),
      photoUri,
      isPublic,
    };

    await addJournalEntry(entry);
    
    // Navigate back to journal
    router.replace('/(tabs)/journal');
  };

  const handleCancel = () => {
    if (notes.trim() || photoUri) {
      Alert.alert(
        'Discard entry?',
        'Your changes will be lost.',
        [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Entry</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Ionicons name="checkmark" size={28} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Prompt Display */}
        <View style={styles.promptSection}>
          <Text style={styles.promptLabel}>Prompt</Text>
          <Text style={styles.promptText}>{promptText}</Text>
        </View>

        {/* Photo Section */}
        {photoUri ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#6366f1" />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#6366f1" />
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notes Input */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Your thoughts</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did it go? What did you create or discover?"
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Visibility Toggle */}
        <View style={styles.visibilitySection}>
          <View style={styles.visibilityInfo}>
            <Ionicons 
              name={isPublic ? 'globe' : 'lock-closed'} 
              size={24} 
              color="#6366f1" 
            />
            <View style={styles.visibilityText}>
              <Text style={styles.visibilityTitle}>
                {isPublic ? 'Public Entry' : 'Private Entry'}
              </Text>
              <Text style={styles.visibilityDescription}>
                {isPublic 
                  ? 'Visible in your public journal' 
                  : 'Only visible to you'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, isPublic && styles.toggleButtonActive]}
            onPress={() => setIsPublic(!isPublic)}
            activeOpacity={0.7}
          >
            <View style={[styles.toggleCircle, isPublic && styles.toggleCircleActive]} />
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
  headerButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  promptSection: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 26,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  visibilitySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  visibilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  visibilityText: {
    flex: 1,
  },
  visibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  visibilityDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggleButton: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#6366f1',
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
});
