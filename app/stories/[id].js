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

    // TTS state variables
    const [ttsSound, setTtsSound] = useState(null);
    const [isTtsPlaying, setIsTtsPlaying] = useState(false);
    const [isTtsLoading, setIsTtsLoading] = useState(false);
    const [ttsProgress, setTtsProgress] = useState(0);
    const ttsProgressIntervalRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stories/${id}`)
            .then((res) => res.json())
            .then((data) => setStory(data));

        // Initialize ratings and get current rating
        const loadRatings = async () => {
            await initializeRatings();
            const rating = getRating(id);
            setCurrentRating(rating);
        };

        loadRatings();

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

    useFocusEffect(
        useCallback(() => {
            // Wenn die Seite Fokus bekommt, Progress-Tracking wieder starten falls Audio läuft
            console.log('Focus gained - checking audio states');

            // Progress-Tracking für main audio wieder starten falls es läuft
            if (isPlaying && sound && !progressIntervalRef.current) {
                console.log('Restarting main audio progress tracking');
                progressIntervalRef.current = setInterval(async () => {
                    try {
                        const status = await sound.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) {
                            setProgress(status.positionMillis / status.durationMillis);
                        }
                    } catch (error) {
                        console.error('Error getting playback status:', error);
                    }
                }, 500);
            }

            // Progress-Tracking für TTS audio wieder starten falls es läuft
            if (isTtsPlaying && ttsSound && !ttsProgressIntervalRef.current) {
                console.log('Restarting TTS progress tracking');
                ttsProgressIntervalRef.current = setInterval(async () => {
                    try {
                        const status = await ttsSound.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) {
                            setTtsProgress(status.positionMillis / status.durationMillis);
                        }
                    } catch (error) {
                        console.error('Error getting TTS playback status:', error);
                    }
                }, 500);
            }

            return () => {
                // Cleanup function - wird ausgeführt wenn Component den Fokus verliert
                // oder unmounted wird

                // Nur pausieren, nicht stoppen, damit Position erhalten bleibt
                if (isPlaying && sound) {
                    console.log('Focus lost - pausing main audio');
                    sound.pauseAsync().catch((error) => {
                        console.error('Error pausing sound on focus loss:', error);
                    });
                    setIsPlaying(false);
                }

                if (isTtsPlaying && ttsSound) {
                    console.log('Focus lost - pausing TTS audio');
                    ttsSound.pauseAsync().catch((error) => {
                        console.error('Error pausing TTS sound on focus loss:', error);
                    });
                    setIsTtsPlaying(false);
                }

                // Progress Intervals stoppen
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }

                if (ttsProgressIntervalRef.current) {
                    clearInterval(ttsProgressIntervalRef.current);
                    ttsProgressIntervalRef.current = null;
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

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: `${AUDIO_BASE_URL}/${story.audioUrl}` },
                { shouldPlay: false }
            );

            setSound(newSound);
            setIsLoading(false);

            // Set up status update listener
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setProgress(1.0);
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
        console.log('playSound called');

        // Stoppe TTS wenn es läuft
        if (isTtsPlaying && ttsSound) {
            console.log('Stopping TTS before playing main audio');
            await ttsSound.pauseAsync();
            setIsTtsPlaying(false);
            if (ttsProgressIntervalRef.current) {
                clearInterval(ttsProgressIntervalRef.current);
                ttsProgressIntervalRef.current = null;
            }
        }

        let currentSound = sound;
        if (!currentSound) {
            currentSound = await loadSound();
            if (!currentSound) return;
        }

        try {
            const status = await currentSound.getStatusAsync();
            if (status.isLoaded) {
                // Check if the sound was paused - if so, resume from current position
                if (!status.isPlaying && status.positionMillis > 0) {
                    await currentSound.playAsync();
                    // Aktuellen Progress sofort setzen
                    setProgress(status.positionMillis / status.durationMillis);
                } else {
                    // If it's at the beginning or stopped, start from beginning
                    await currentSound.replayAsync();
                    setProgress(0);
                }
                setIsPlaying(true);

                // Start tracking progress
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                }

                progressIntervalRef.current = setInterval(async () => {
                    try {
                        const status = await currentSound.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) {
                            setProgress(status.positionMillis / status.durationMillis);
                        }
                    } catch (error) {
                        console.error('Error getting playback status:', error);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
            setIsPlaying(false);
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

            const { sound: newTtsSound } = await Audio.Sound.createAsync(
                { uri: `${AUDIO_BASE_URL}/${story.ttsUrl}` },
                { shouldPlay: false }
            );

            setTtsSound(newTtsSound);
            setIsTtsLoading(false);

            // Set up status update listener
            newTtsSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        setIsTtsPlaying(false);
                        setTtsProgress(1.0);
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
        console.log('playTtsSound called');

        // Stoppe main audio wenn es läuft
        if (isPlaying && sound) {
            console.log('Stopping main audio before playing TTS');
            await sound.pauseAsync();
            setIsPlaying(false);
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
        }

        let currentTtsSound = ttsSound;
        if (!currentTtsSound) {
            currentTtsSound = await loadTtsSound();
            if (!currentTtsSound) return;
        }

        try {
            const status = await currentTtsSound.getStatusAsync();
            if (status.isLoaded) {
                // Check if the sound was paused - if so, resume from current position
                if (!status.isPlaying && status.positionMillis > 0) {
                    await currentTtsSound.playAsync();
                    // Aktuellen Progress sofort setzen
                    setTtsProgress(status.positionMillis / status.durationMillis);
                } else {
                    // If it's at the beginning or stopped, start from beginning
                    await currentTtsSound.replayAsync();
                    setTtsProgress(0);
                }
                setIsTtsPlaying(true);

                // Start tracking progress
                if (ttsProgressIntervalRef.current) {
                    clearInterval(ttsProgressIntervalRef.current);
                }

                ttsProgressIntervalRef.current = setInterval(async () => {
                    try {
                        const status = await currentTtsSound.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) {
                            setTtsProgress(status.positionMillis / status.durationMillis);
                        }
                    } catch (error) {
                        console.error('Error getting TTS playback status:', error);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error playing TTS sound:', error);
            setIsTtsPlaying(false);
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
                            source={{ uri: `${IMAGES_BASE_URL}/${story.coverImageUrl}` }}
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
                            style={[
                                Styles.storyDetail.audioButton,
                                { backgroundColor: (!isPlaying && progress === 0) ? "#666" : "#b71c1c" }
                            ]}

                            onPress={stopSound}
                            disabled={isLoading || (!isPlaying && progress === 0)}
                        >
                            <Ionicons
                                name="stop"
                                size={24}
                                color={(!isPlaying && progress === 0) ? "#ccc" : "white"}
                            />
                        </TouchableOpacity>

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
                        onPress={() => Linking.openURL(`${VIDEO_BASE_URL}/${story.videoUrl}`)}
                    >
                        <Text style={Styles.storyDetail.videoButtonText}>
                            <Ionicons name="videocam-outline" size={16} color="white" /> Video abspielen
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
                            style={[
                                Styles.storyDetail.audioButton,
                                { backgroundColor: (!isTtsPlaying && ttsProgress === 0) ? "#666" : "#b71c1c" }
                            ]}
                            onPress={stopTtsSound}
                            disabled={isTtsLoading || (!isTtsPlaying && ttsProgress === 0)}
                        >
                            <Ionicons
                                name="stop"
                                size={24}
                                color={(!isTtsPlaying && ttsProgress === 0) ? "#ccc" : "white"}
                            />
                        </TouchableOpacity>

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
                                source={{ uri: `${IMAGES_BASE_URL}/${story.coverImageUrl}` }}
                                style={Styles.storyDetail.modalImage}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}