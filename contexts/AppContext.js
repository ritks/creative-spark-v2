import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [interests, setInterests] = useState([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [lastPromptDate, setLastPromptDate] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app state from AsyncStorage
  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const [
        storedInterests,
        storedOnboarding,
        storedPrompt,
        storedDate,
        storedEntries
      ] = await Promise.all([
        AsyncStorage.getItem('interests'),
        AsyncStorage.getItem('hasCompletedOnboarding'),
        AsyncStorage.getItem('dailyPrompt'),
        AsyncStorage.getItem('lastPromptDate'),
        AsyncStorage.getItem('journalEntries')
      ]);

      if (storedInterests) setInterests(JSON.parse(storedInterests));
      if (storedOnboarding) setHasCompletedOnboarding(JSON.parse(storedOnboarding));
      if (storedPrompt) setDailyPrompt(JSON.parse(storedPrompt));
      if (storedDate) setLastPromptDate(storedDate);
      if (storedEntries) setJournalEntries(JSON.parse(storedEntries));

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load app state:', error);
      setIsLoading(false);
    }
  };

  const saveInterests = async (newInterests) => {
    setInterests(newInterests);
    await AsyncStorage.setItem('interests', JSON.stringify(newInterests));
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(true));
  };

  const updateDailyPrompt = async (prompt) => {
    const today = new Date().toDateString();
    setDailyPrompt(prompt);
    setLastPromptDate(today);
    await AsyncStorage.setItem('dailyPrompt', JSON.stringify(prompt));
    await AsyncStorage.setItem('lastPromptDate', today);
  };

  const addJournalEntry = async (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      createdAt: new Date().toISOString()
    };
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const updateJournalEntry = async (id, updates) => {
    const updatedEntries = journalEntries.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    setJournalEntries(updatedEntries);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const deleteJournalEntry = async (id) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
  };

  const value = {
    interests,
    saveInterests,
    hasCompletedOnboarding,
    completeOnboarding,
    dailyPrompt,
    lastPromptDate,
    updateDailyPrompt,
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
