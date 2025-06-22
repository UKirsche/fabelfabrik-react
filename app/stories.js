import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL, IMAGES_BASE_URL } from '../config';
import { Styles } from '../constants/Styles';
import { Colors } from '../constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useFavoriteStore } from '../store/favoriteStore';

export default function StoryListScreen() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Access favorite store
    const { 
        favorites, 
        isFavorite, 
        toggleFavorite, 
        initialize, 
        showOnlyFavorites, 
        toggleShowOnlyFavorites 
    } = useFavoriteStore();

    // Initialize favorites from storage
    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        console.log('🚀 Loading stories from:', API_BASE_URL);
        setLoading(true);

        fetch(`${API_BASE_URL}/stories`)
            .then((res) => res.json())
            .then((data) => {
                console.log('📚 Total stories loaded:', data.length);

                // Log jede Geschichte einzeln
                data.forEach((story, index) => {
                    console.log(`📖 Story ${index + 1}:`);
                    console.log(`   ID: ${story.id || story._id}`);
                    console.log(`   Title: "${story.title}"`);
                    console.log(`   Image: "${story.coverImageUrl}"`);
                    console.log(`   Content: "${story.content?.substring(0, 50)}..."`);
                    console.log(`   Content Length: ${story.content?.length || 0} characters`);
                    console.log(`   Full story object:`, JSON.stringify(story, null, 2));
                });

                // Sort stories by date (newest first)
                // Das Feld vom Server heißt createdAt
                const dateField = 'createdAt';
                console.log(`🔍 Using date field: ${dateField}`);

                const sortedData = [...data].sort((a, b) => {
                    if (a[dateField] && b[dateField]) {
                        // Sort in descending order (newest first)
                        return new Date(b[dateField]) - new Date(a[dateField]);
                    }

                    // If no date field is found, maintain original order
                    return 0;
                });

                // Log the first few stories with their dates to verify sorting
                console.log('📅 First few stories after sorting:');
                sortedData.slice(0, 3).forEach((story, index) => {
                    console.log(`   Story ${index + 1}: "${story.title}" - Date: ${new Date(story[dateField]).toISOString()}`);
                });

                setStories(sortedData);
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error loading stories:', err);
                setLoading(false);
            });
    }, []);

    // Filter stories based on showOnlyFavorites state
    const filteredStories = showOnlyFavorites
        ? stories.filter(story => isFavorite(story.id || story._id))
        : stories;


    return (
        <View style={Styles.container.padded}>
            {/* Filter button */}
            <View style={Styles.layout.filterContainer}>
                <Button
                    title={showOnlyFavorites ? "Alle anzeigen" : "Nur Favoriten"}
                    onPress={toggleShowOnlyFavorites}
                    color={Colors.light.brand}
                />
            </View>

            {loading ? (
                <View style={Styles.container.centered}>
                    <ActivityIndicator size="large" color={Colors.light.brand} />
                    <Text style={Styles.text.loadingText}>
                        Der Server wacht auf… bitte einen Moment Geduld.{"\n"}
                        Die Bilder kommen verzögert nach dem Laden der Seite.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredStories}
                    keyExtractor={(item) => item.id || item._id}
                    renderItem={({ item }) => (
                        <View style={Styles.container.storyItem}>
                            <TouchableOpacity
                                onPress={() => router.push(`/stories/${item.id || item._id}`)}
                                style={{ flex: 1, flexDirection: 'row' }}>
                                {item.coverImageUrl && (
                                    <Image
                                        source={{ uri: `${IMAGES_BASE_URL}/${item.coverImageUrl}` }}
                                        style={Styles.image.storyImage}
                                        resizeMode="cover"
                                    />
                                )}
                                <View style={Styles.container.storyContent}>
                                    <Text style={Styles.text.storyTitle}>{item.title}</Text>
                                    <Text numberOfLines={2} style={Styles.text.storyDescription}>{item.description}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Favorite heart icon */}
                            <TouchableOpacity
                                onPress={() => toggleFavorite(item.id || item._id)}
                                style={Styles.image.favoriteIcon}>
                                <AntDesign
                                    name={isFavorite(item.id || item._id) ? "heart" : "hearto"}
                                    size={24}
                                    color={isFavorite(item.id || item._id) ? "red" : "gray"}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}