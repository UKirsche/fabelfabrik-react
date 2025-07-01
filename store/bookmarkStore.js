import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_STORAGE_KEY = 'fabelfabrik_read_stories';

// Helper function to load bookmarks from AsyncStorage
const loadBookmarksFromStorage = async () => {
  try {
    const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks from storage:', error);
    return [];
  }
};

// Helper function to save bookmarks to AsyncStorage
const saveBookmarksToStorage = async (bookmarks) => {
  try {
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks to storage:', error);
  }
};

export const useBookmarkStore = create((set, get) => ({
  // State
  bookmarks: [],
  isLoading: false,
  showOnlyBookmarks: false,

  // Actions
  initialize: async () => {
    set({ isLoading: true });
    const bookmarks = await loadBookmarksFromStorage();
    set({ bookmarks, isLoading: false });
  },

  markAsRead: async (storyId) => {
    const { bookmarks } = get();
    if (!bookmarks.includes(storyId)) {
      const updatedBookmarks = [...bookmarks, storyId];
      set({ bookmarks: updatedBookmarks });
      await saveBookmarksToStorage(updatedBookmarks);
    }
  },

  toggleBookmark: async (storyId) => {
    const { bookmarks } = get();
    const isBookmarked = bookmarks.includes(storyId);
    
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(id => id !== storyId)
      : [...bookmarks, storyId];
    
    set({ bookmarks: updatedBookmarks });
    await saveBookmarksToStorage(updatedBookmarks);
  },

  isBookmarked: (storyId) => {
    return get().bookmarks.includes(storyId);
  },

  toggleShowOnlyBookmarks: () => {
    set(state => ({ showOnlyBookmarks: !state.showOnlyBookmarks }));
  },

  clearAllBookmarks: async () => {
    set({ bookmarks: [] });
    await saveBookmarksToStorage([]);
  }
}));