import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL, IMAGES_BASE_URL, AUDIO_BASE_URL, VIDEO_BASE_URL } from '../config';

const CACHED_STORIES_KEY = 'fabelfabrik_cached_stories';
const CACHE_DIRECTORY = FileSystem.documentDirectory + 'fabelfabrik_cache/';

// Helper function to ensure cache directory exists
const ensureCacheDirectoryExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, { intermediates: true });
  }
};

// Helper function to load cached story IDs from AsyncStorage
const loadCachedStoriesFromStorage = async () => {
  try {
    const storedCachedStories = await AsyncStorage.getItem(CACHED_STORIES_KEY);
    return storedCachedStories ? JSON.parse(storedCachedStories) : {};
  } catch (error) {
    console.error('Error loading cached stories from storage:', error);
    return {};
  }
};

// Helper function to save cached story IDs to AsyncStorage
const saveCachedStoriesToStorage = async (cachedStories) => {
  try {
    await AsyncStorage.setItem(CACHED_STORIES_KEY, JSON.stringify(cachedStories));
  } catch (error) {
    console.error('Error saving cached stories to storage:', error);
  }
};

// Helper function to download a file and save it to cache
const downloadFile = async (url, localPath) => {
  try {
    const result = await FileSystem.downloadAsync(url, localPath);
    return result.status === 200;
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error);
    return false;
  }
};

export const useCacheStore = create((set, get) => ({
  // State
  cachedStories: {}, // { storyId: { story: {}, assets: { coverImage: 'path', audio: 'path', ... } } }
  isLoading: false,

  // Actions
  initialize: async () => {
    set({ isLoading: true });
    await ensureCacheDirectoryExists();
    const cachedStories = await loadCachedStoriesFromStorage();
    set({ cachedStories, isLoading: false });
  },

  // Check if a story is cached
  isStoryCached: (storyId) => {
    const { cachedStories } = get();
    return !!cachedStories[storyId];
  },

  // Get a cached story
  getCachedStory: (storyId) => {
    const { cachedStories } = get();
    return cachedStories[storyId]?.story || null;
  },

  // Get a cached asset path
  getCachedAssetPath: (storyId, assetType) => {
    const { cachedStories } = get();
    return cachedStories[storyId]?.assets?.[assetType] || null;
  },

  // Get all cached stories
  getAllCachedStories: () => {
    const { cachedStories } = get();
    return Object.entries(cachedStories).map(([id, data]) => ({
      ...data.story,
      id: data.story.id || data.story._id || id
    }));
  },

  // Cache a story and its assets
  cacheStory: async (story) => {
    set({ isLoading: true });

    try {
      await ensureCacheDirectoryExists();
      const storyId = story.id || story._id;
      const storyDirectory = CACHE_DIRECTORY + storyId + '/';

      // Create directory for this story
      const dirInfo = await FileSystem.getInfoAsync(storyDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(storyDirectory, { intermediates: true });
      }

      // Initialize assets object to track cached asset paths
      const assets = {};

      // Download and cache cover image if it exists
      if (story.coverImageUrl) {
        const imageUrl = `${IMAGES_BASE_URL}/${story.coverImageUrl}`;
        const imageName = story.coverImageUrl.split('/').pop();
        const imagePath = storyDirectory + imageName;

        const imageSuccess = await downloadFile(imageUrl, imagePath);
        if (imageSuccess) {
          assets.coverImage = imagePath;
        }
      }

      // Download and cache audio if it exists
      if (story.audioUrl) {
        const audioUrl = `${AUDIO_BASE_URL}/${story.audioUrl}`;
        const audioName = story.audioUrl.split('/').pop();
        const audioPath = storyDirectory + audioName;

        const audioSuccess = await downloadFile(audioUrl, audioPath);
        if (audioSuccess) {
          assets.audio = audioPath;
        }
      }

      // Download and cache TTS audio if it exists
      if (story.ttsUrl) {
        const ttsUrl = `${AUDIO_BASE_URL}/${story.ttsUrl}`;
        const ttsName = story.ttsUrl.split('/').pop();
        const ttsPath = storyDirectory + ttsName;

        const ttsSuccess = await downloadFile(ttsUrl, ttsPath);
        if (ttsSuccess) {
          assets.tts = ttsPath;
        }
      }

      // Download and cache video if it exists
      if (story.videoUrl) {
        const videoUrl = `${VIDEO_BASE_URL}/${story.videoUrl}`;
        const videoName = story.videoUrl.split('/').pop();
        const videoPath = storyDirectory + videoName;

        const videoSuccess = await downloadFile(videoUrl, videoPath);
        if (videoSuccess) {
          assets.video = videoPath;
        }
      }

      // Update cachedStories state
      const { cachedStories } = get();
      const updatedCachedStories = {
        ...cachedStories,
        [storyId]: {
          story: { ...story },
          assets,
          cachedAt: new Date().toISOString()
        }
      };

      set({ cachedStories: updatedCachedStories, isLoading: false });
      await saveCachedStoriesToStorage(updatedCachedStories);

      return true;
    } catch (error) {
      console.error('Error caching story:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Remove a story from cache
  removeFromCache: async (storyId) => {
    set({ isLoading: true });

    try {
      const { cachedStories } = get();

      // If story isn't cached, do nothing
      if (!cachedStories[storyId]) {
        set({ isLoading: false });
        return true;
      }

      // Delete story directory and all its contents
      const storyDirectory = CACHE_DIRECTORY + storyId + '/';
      await FileSystem.deleteAsync(storyDirectory, { idempotent: true });

      // Update cachedStories state
      const { [storyId]: removedStory, ...remainingStories } = cachedStories;
      set({ cachedStories: remainingStories, isLoading: false });
      await saveCachedStoriesToStorage(remainingStories);

      return true;
    } catch (error) {
      console.error('Error removing story from cache:', error);
      set({ isLoading: false });
      return false;
    }
  },

  // Clear all cached stories
  clearCache: async () => {
    set({ isLoading: true });

    try {
      // Delete cache directory and all its contents
      await FileSystem.deleteAsync(CACHE_DIRECTORY, { idempotent: true });

      // Recreate empty cache directory
      await ensureCacheDirectoryExists();

      // Update cachedStories state
      set({ cachedStories: {}, isLoading: false });
      await saveCachedStoriesToStorage({});

      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      set({ isLoading: false });
      return false;
    }
  }
}));
