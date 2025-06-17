import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, IMAGES_BASE_URL, PDF_BASE_URL, AUDIO_BASE_URL, VIDEO_BASE_URL } from '../../config';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 16,
    },
    mediaContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    coverImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 16,
    },
    mediaContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
        color: '#666',
    },
    pdfButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
    },
    pdfButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    audioContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
    },
    audioControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    audioTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    audioButton: {
        backgroundColor: '#007AFF',
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButton: {
        backgroundColor: '#34C759',
        padding: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
    downloadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    progressContainer: {
        flex: 1,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        marginHorizontal: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },

    // Video Styles
    videoContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    videoButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
    },
    videoButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // TTS File Styles
    ttsFileContainer: {
        backgroundColor: '#e8f4fd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
    },
    ttsFileTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007AFF',
    },
    ttsFileButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
    },
    ttsFileButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: screenWidth - 40,
        height: screenHeight - 100,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function StoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const [story, setStory] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const progressIntervalRef = useRef(null);

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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{story.title}</Text>

            <View style={styles.mediaContainer}>
                {story.coverImageUrl && (
                    <TouchableOpacity onPress={openImageModal}>
                        <Image
                            source={{ uri: `${IMAGES_BASE_URL}/${story.coverImageUrl}` }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.mediaContent}>
                    {story.description && (
                        <Text style={styles.description}>{story.description}</Text>
                    )}

                    {story.pdfUrl && (
                        <TouchableOpacity 
                            style={styles.pdfButton} 
                            onPress={openPDF}
                        >
                            <Text style={styles.pdfButtonText}>PDF öffnen</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {story.audioUrl && (
                <View style={styles.audioContainer}>
                    <Text style={styles.audioTitle}>Hintergrundmusik</Text>
                    <View style={styles.audioControls}>
                        <TouchableOpacity 
                            style={styles.audioButton}
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

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                        </View>

                        <TouchableOpacity 
                            style={styles.downloadButton}
                            onPress={downloadAudio}
                        >
                            <Text style={styles.downloadButtonText}>
                                <Ionicons name="download-outline" size={16} color="white" /> MP3
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Video Container - only show if videoUrl exists */}
            {story.videoUrl && (
                <View style={styles.videoContainer}>
                    <Text style={styles.videoTitle}>Video</Text>
                    <TouchableOpacity 
                        style={styles.videoButton}
                        onPress={() => Linking.openURL(`${VIDEO_BASE_URL}/${story.videoUrl}`)}
                    >
                        <Text style={styles.videoButtonText}>
                            <Ionicons name="videocam-outline" size={16} color="white" /> Video abspielen
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* TTS File Container - only show if ttsUrl exists */}
            {story.ttsUrl && (
                <View style={styles.ttsFileContainer}>
                    <Text style={styles.ttsFileTitle}>Vorlesen</Text>
                    <View style={styles.audioControls}>
                        <TouchableOpacity 
                            style={styles.audioButton}
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

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: `${ttsProgress * 100}%` }]} />
                        </View>

                        <TouchableOpacity 
                            style={styles.downloadButton}
                            onPress={downloadTts}
                        >
                            <Text style={styles.downloadButtonText}>
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

            {/* Image Modal */}
            <Modal
                visible={imageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity 
                        style={styles.closeButton}
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
                                style={styles.modalImage}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}
