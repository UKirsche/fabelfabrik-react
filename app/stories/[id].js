import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, IMAGES_BASE_URL, PDF_BASE_URL, AUDIO_BASE_URL, VIDEO_BASE_URL } from '../../config';
import { Styles } from '../../constants/Styles';
import { useRatingStore } from '../../store/ratingStore';
import { useCacheStore } from '../../store/cacheStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const [story, setStory] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const progressIntervalRef = useRef(null);

    // Rating state and functions
    const { initialize: initializeRatings, getRating, setRating } = useRatingStore();
    const [currentRating, setCurrentRating] = useState(0);

    // Cache state and functions
    const { 
        initialize: initializeCache, 
        isStoryCached, 
        getCachedStory, 
        getCachedAssetPath 
    } = useCacheStore();
    const [isUsingCache, setIsUsingCache] = useState(false);

    // TTS state variables
    const [ttsSound, setTtsSound] = useState(null);
    const [isTtsPlaying, setIsTtsPlaying] = useState(false);
    const [isTtsLoading, setIsTtsLoading] = useState(false);
    const [ttsProgress, setTtsProgress] = useState(0);
    const ttsProgressIntervalRef = useRef(null);

    useEffect(() => {
        // Initialize cache and ratings
        const initialize = async () => {
            await initializeCache();
            await initializeRatings();

            // Get rating
            const rating = getRating(id);
            setCurrentRating(rating);

            // Check if story is cached
            if (isStoryCached(id)) {
                console.log('Loading story from cache');
                const cachedStory = getCachedStory(id);
                setStory(cachedStory);
                setIsUsingCache(true);
            } else {
                console.log('Loading story from API');
                // Fetch from API if not cached
                try {
                    const response = await fetch(`${API_BASE_URL}/stories/${id}`);
                    const data = await response.json();
                    setStory(data);
                    setIsUsingCache(false);
                } catch (error) {
                    console.error('Error fetching story:', error);
                }
            }
        };

        initialize();

        // Cleanup function to unload sound when component unmounts
        return () => {
            if (sound) {
                stopSound();
                sound.unloadAsync();
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            // Clean up TTS sound
            if (ttsSound) {
                stopTtsSound();
                ttsSound.unloadAsync();
            }
            if (ttsProgressIntervalRef.current) {
                clearInterval(ttsProgressIntervalRef.current);
            }

            // Stop TTS when component unmounts
            Speech.stop();
        };
    }, [id]);

    // Stop all audio playback when navigating away from the screen
    useFocusEffect(
        useCallback(() => {
            // This runs when the screen comes into focus

            // Return a cleanup function that runs when the screen goes out of focus
            return () => {
                // Stop main audio if playing
                if (isPlaying && sound) {
                    stopSound();
                }

                // Stop TTS audio if playing
                if (isTtsPlaying && ttsSound) {
                    stopTtsSound();
                }
            };
        }, [isPlaying, isTtsPlaying, sound, ttsSound])
    );

    if (!story) return <Text>Lädt...</Text>;

    const openPDF = () => {
        if (story.pdfUrl) {
            Linking.openURL(`${PDF_BASE_URL}/${story.pdfUrl}`);
        }
    };

    const openImageModal = () => {
        setImageModalVisible(true);
    };

    const closeImageModal = () => {
        setImageModalVisible(false);
    };

    const loadSound = async () => {
        try {
            setIsLoading(true);
            // Unload any existing sound
            if (sound) {
                await sound.unloadAsync();
            }

            // Determine audio source (cached or remote)
            let audioUri;
            if (isUsingCache && story.audioUrl) {
                const cachedAudioPath = getCachedAssetPath(id, 'audio');
                if (cachedAudioPath) {
                    console.log('Using cached audio:', cachedAudioPath);
                    audioUri = cachedAudioPath;
                } else {
                    console.log('Cached audio not found, using remote audio');
                    audioUri = `${AUDIO_BASE_URL}/${story.audioUrl}`;
                }
            } else {
                audioUri = `${AUDIO_BASE_URL}/${story.audioUrl}`;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: false }
            );

            setSound(newSound);
            setIsLoading(false);

            // Set up status update listener
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setProgress(0);
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                    }
                }
            });

            return newSound;
        } catch (error) {
            console.error('Error loading sound:', error);
            setIsLoading(false);
            return null;
        }
    };

    const playSound = async () => {
        // Stop TTS sound if it's playing
        if (isTtsPlaying) {
            await stopTtsSound();
        }

        let currentSound = sound;
        if (!currentSound) {
            currentSound = await loadSound();
            if (!currentSound) return;
        }

        try {
            const status = await currentSound.getStatusAsync();
            if (status.isLoaded) {
                await currentSound.playAsync();
                setIsPlaying(true);

                // Start tracking progress
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                }

                progressIntervalRef.current = setInterval(async () => {
                    const status = await currentSound.getStatusAsync();
                    if (status.isLoaded) {
                        setProgress(status.positionMillis / status.durationMillis);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        }
    };

    const stopSound = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
            setProgress(0);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        }
    };

    const downloadAudio = () => {
        if (story.audioUrl) {
            Linking.openURL(`${AUDIO_BASE_URL}/${story.audioUrl}`);
        }
    };

    // TTS Functions
    const loadTtsSound = async () => {
        try {
            setIsTtsLoading(true);
            // Unload any existing TTS sound
            if (ttsSound) {
                await ttsSound.unloadAsync();
            }

            // Determine TTS audio source (cached or remote)
            let ttsUri;
            if (isUsingCache && story.ttsUrl) {
                const cachedTtsPath = getCachedAssetPath(id, 'tts');
                if (cachedTtsPath) {
                    console.log('Using cached TTS audio:', cachedTtsPath);
                    ttsUri = cachedTtsPath;
                } else {
                    console.log('Cached TTS audio not found, using remote TTS audio');
                    ttsUri = `${AUDIO_BASE_URL}/${story.ttsUrl}`;
                }
            } else {
                ttsUri = `${AUDIO_BASE_URL}/${story.ttsUrl}`;
            }

            const { sound: newTtsSound } = await Audio.Sound.createAsync(
                { uri: ttsUri },
                { shouldPlay: false }
            );

            setTtsSound(newTtsSound);
            setIsTtsLoading(false);

            // Set up status update listener
            newTtsSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsTtsPlaying(false);
                        setTtsProgress(0);
                        clearInterval(ttsProgressIntervalRef.current);
                        ttsProgressIntervalRef.current = null;
                    }
                }
            });

            return newTtsSound;
        } catch (error) {
            console.error('Error loading TTS sound:', error);
            setIsTtsLoading(false);
            return null;
        }
    };

    const playTtsSound = async () => {
        // Stop main audio if it's playing
        if (isPlaying) {
            await stopSound();
        }

        let currentTtsSound = ttsSound;
        if (!currentTtsSound) {
            currentTtsSound = await loadTtsSound();
            if (!currentTtsSound) return;
        }

        try {
            const status = await currentTtsSound.getStatusAsync();
            if (status.isLoaded) {
                await currentTtsSound.playAsync();
                setIsTtsPlaying(true);

                // Start tracking progress
                if (ttsProgressIntervalRef.current) {
                    clearInterval(ttsProgressIntervalRef.current);
                }

                ttsProgressIntervalRef.current = setInterval(async () => {
                    const status = await currentTtsSound.getStatusAsync();
                    if (status.isLoaded) {
                        setTtsProgress(status.positionMillis / status.durationMillis);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error playing TTS sound:', error);
        }
    };

    const pauseTtsSound = async () => {
        if (ttsSound) {
            await ttsSound.pauseAsync();
            setIsTtsPlaying(false);
            if (ttsProgressIntervalRef.current) {
                clearInterval(ttsProgressIntervalRef.current);
                ttsProgressIntervalRef.current = null;
            }
        }
    };

    const stopTtsSound = async () => {
        if (ttsSound) {
            await ttsSound.stopAsync();
            setIsTtsPlaying(false);
            setTtsProgress(0);
            if (ttsProgressIntervalRef.current) {
                clearInterval(ttsProgressIntervalRef.current);
                ttsProgressIntervalRef.current = null;
            }
        }
    };

    const downloadTts = () => {
        if (story.ttsUrl) {
            Linking.openURL(`${AUDIO_BASE_URL}/${story.ttsUrl}`);
        }
    };

    // Handle rating change
    const handleRating = (rating) => {
        setCurrentRating(rating);
        setRating(id, rating);
    };

    // Star Rating component
    const StarRating = ({ rating, onRatingChange, size = 24, color = "#FFD700" }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => onRatingChange(star)}
                        style={{ padding: 5 }}
                    >
                        <Ionicons
                            name={rating >= star ? "star" : "star-outline"}
                            size={size}
                            color={color}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={Styles.storyDetail.container}>
            <Text style={Styles.storyDetail.title}>{story.title}</Text>

            <View style={Styles.storyDetail.mediaContainer}>
                {story.coverImageUrl && (
                    <TouchableOpacity onPress={openImageModal}>
                        <Image
                            source={{ 
                                uri: isUsingCache && getCachedAssetPath(id, 'coverImage')
                                    ? getCachedAssetPath(id, 'coverImage')
                                    : `${IMAGES_BASE_URL}/${story.coverImageUrl}`
                            }}
                            style={Styles.storyDetail.coverImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}

                <View style={Styles.storyDetail.mediaContent}>
                    {story.description && (
                        <Text style={Styles.storyDetail.description}>{story.description}</Text>
                    )}

                    {story.pdfUrl && (
                        <TouchableOpacity 
                            style={Styles.storyDetail.pdfButton} 
                            onPress={openPDF}
                        >
                            <Text style={Styles.storyDetail.pdfButtonText}>
                                <Ionicons name="document-text-outline" size={16} color="white" /> PDF öffnen
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {story.audioUrl && (
                <View style={Styles.storyDetail.audioContainer}>
                    <Text style={Styles.storyDetail.audioTitle}>Titellied</Text>
                    <View style={Styles.storyDetail.audioControls}>
                        <TouchableOpacity 
                            style={Styles.storyDetail.audioButton}
                            onPress={isPlaying ? pauseSound : playSound}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Ionicons 
                                    name={isPlaying ? "pause" : "play"} 
                                    size={24} 
                                    color="white" 
                                />
                            )}
                        </TouchableOpacity>

                        <View style={Styles.storyDetail.progressContainer}>
                            <View style={[Styles.storyDetail.progressBar, { width: `${progress * 100}%` }]} />
                        </View>

                        <TouchableOpacity 
                            style={Styles.storyDetail.downloadButton}
                            onPress={downloadAudio}
                        >
                            <Text style={Styles.storyDetail.downloadButtonText}>
                                <Ionicons name="download-outline" size={16} color="white" /> MP3
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Video Container - only show if videoUrl exists */}
            {story.videoUrl && (
                <View style={Styles.storyDetail.videoContainer}>
                    <Text style={Styles.storyDetail.videoTitle}>Video</Text>
                    <TouchableOpacity 
                        style={Styles.storyDetail.videoButton}
                        onPress={() => {
                            // Use cached video if available, otherwise use remote URL
                            const videoUri = isUsingCache && getCachedAssetPath(id, 'video')
                                ? getCachedAssetPath(id, 'video')
                                : `${VIDEO_BASE_URL}/${story.videoUrl}`;

                            console.log('Opening video:', videoUri);
                            Linking.openURL(videoUri);
                        }}
                    >
                        <Text style={Styles.storyDetail.videoButtonText}>
                            <Ionicons name="videocam-outline" size={16} color="white" /> Video abspielen
                            {isUsingCache && getCachedAssetPath(id, 'video') ? ' (Offline)' : ''}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* TTS File Container - only show if ttsUrl exists */}
            {story.ttsUrl && (
                <View style={Styles.storyDetail.ttsFileContainer}>
                    <Text style={Styles.storyDetail.ttsFileTitle}>Vorlesen</Text>
                    <View style={Styles.storyDetail.audioControls}>
                        <TouchableOpacity 
                            style={Styles.storyDetail.audioButton}
                            onPress={isTtsPlaying ? pauseTtsSound : playTtsSound}
                            disabled={isTtsLoading}
                        >
                            {isTtsLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Ionicons 
                                    name={isTtsPlaying ? "pause" : "play"} 
                                    size={24} 
                                    color="white" 
                                />
                            )}
                        </TouchableOpacity>

                        <View style={Styles.storyDetail.progressContainer}>
                            <View style={[Styles.storyDetail.progressBar, { width: `${ttsProgress * 100}%` }]} />
                        </View>

                        <TouchableOpacity 
                            style={Styles.storyDetail.downloadButton}
                            onPress={downloadTts}
                        >
                            <Text style={Styles.storyDetail.downloadButtonText}>
                                <Ionicons name="download-outline" size={16} color="white" /> MP3
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {story.images && story.images.length > 0 &&
                story.images.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={{ width: '100%', height: 200, marginVertical: 8 }} />
                ))
            }

            {/* Rating Section */}
            <View style={{
                marginTop: 20,
                marginBottom: 30,
                padding: 15,
                backgroundColor: '#f8f8f8',
                borderRadius: 10,
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    textAlign: 'center'
                }}>
                    Bewerte diese Geschichte
                </Text>
                <StarRating
                    rating={currentRating}
                    onRatingChange={handleRating}
                    size={32}
                />
                <Text style={{
                    marginTop: 10,
                    fontSize: 14,
                    color: '#666',
                    textAlign: 'center'
                }}>
                    {currentRating > 0 
                        ? `Deine Bewertung: ${currentRating} von 5 Sternen` 
                        : 'Tippe auf die Sterne, um zu bewerten'}
                </Text>
            </View>

            {/* Image Modal */}
            <Modal
                visible={imageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <View style={Styles.storyDetail.modalContainer}>
                    <TouchableOpacity 
                        style={Styles.storyDetail.closeButton}
                        onPress={closeImageModal}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={closeImageModal}
                        activeOpacity={1}
                    >
                        {story.coverImageUrl && (
                            <Image
                                source={{ 
                                    uri: isUsingCache && getCachedAssetPath(id, 'coverImage')
                                        ? getCachedAssetPath(id, 'coverImage')
                                        : `${IMAGES_BASE_URL}/${story.coverImageUrl}`
                                }}
                                style={Styles.storyDetail.modalImage}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}
