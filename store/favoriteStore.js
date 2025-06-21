import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'fabelfabrik_favorite_stories';

// Helper function to load favorites from AsyncStorage
const loadFavoritesFromStorage = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from storage:', error);
    return [];
  }
};

// Helper function to save favorites to AsyncStorage
const saveFavoritesToStorage = async (favorites) => {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to storage:', error);
  }
};

export const useFavoriteStore = create((set, get) => ({
  // State
  favorites: [],
  isLoading: false,
  showOnlyFavorites: false,

  // Actions
  initialize: async () => {
    set({ isLoading: true });
    const favorites = await loadFavoritesFromStorage();
    set({ favorites, isLoading: false });
  },

  toggleFavorite: async (storyId) => {
    const { favorites } = get();
    const isFavorite = favorites.includes(storyId);
    
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== storyId)
      : [...favorites, storyId];
    
    set({ favorites: updatedFavorites });
    await saveFavoritesToStorage(updatedFavorites);
  },

  isFavorite: (storyId) => {
    return get().favorites.includes(storyId);
  },

  toggleShowOnlyFavorites: () => {
    set(state => ({ showOnlyFavorites: !state.showOnlyFavorites }));
  },

  clearAllFavorites: async () => {
    set({ favorites: [] });
    await saveFavoritesToStorage([]);
  }
}));