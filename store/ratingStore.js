import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATINGS_STORAGE_KEY = 'fabelfabrik_story_ratings';

// Helper function to load ratings from AsyncStorage
const loadRatingsFromStorage = async () => {
  try {
    const storedRatings = await AsyncStorage.getItem(RATINGS_STORAGE_KEY);
    return storedRatings ? JSON.parse(storedRatings) : {};
  } catch (error) {
    console.error('Error loading ratings from storage:', error);
    return {};
  }
};

// Helper function to save ratings to AsyncStorage
const saveRatingsToStorage = async (ratings) => {
  try {
    await AsyncStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error saving ratings to storage:', error);
  }
};

export const useRatingStore = create((set, get) => ({
  // State
  ratings: {}, // Object with storyId as key and rating as value
  isLoading: false,

  // Actions
  initialize: async () => {
    set({ isLoading: true });
    const ratings = await loadRatingsFromStorage();
    set({ ratings, isLoading: false });
  },

  setRating: async (storyId, rating) => {
    const { ratings } = get();
    const updatedRatings = {
      ...ratings,
      [storyId]: rating
    };
    
    set({ ratings: updatedRatings });
    await saveRatingsToStorage(updatedRatings);
  },

  getRating: (storyId) => {
    return get().ratings[storyId] || 0;
  },

  clearRating: async (storyId) => {
    const { ratings } = get();
    const updatedRatings = { ...ratings };
    delete updatedRatings[storyId];
    
    set({ ratings: updatedRatings });
    await saveRatingsToStorage(updatedRatings);
  },

  clearAllRatings: async () => {
    set({ ratings: {} });
    await saveRatingsToStorage({});
  }
}));