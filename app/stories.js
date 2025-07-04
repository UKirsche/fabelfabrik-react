import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL, IMAGES_BASE_URL } from '../config';
import { Styles } from '../constants/Styles';
import { Colors } from '../constants/Colors';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFavoriteStore } from '../store/favoriteStore';
import { useBookmarkStore } from '../store/bookmarkStore';

export default function StoryListScreen() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first
    const [activeFilter, setActiveFilter] = useState(null); // 'favorites', 'unread', or null
    const router = useRouter();

    // Access favorite store
    const { 
        favorites, 
        isFavorite, 
        toggleFavorite, 
        initialize: initializeFavorites
    } = useFavoriteStore();

    // Access bookmark store
    const {
        bookmarks,
        isBookmarked,
        toggleBookmark,
        initialize: initializeBookmarks
    } = useBookmarkStore();

    // Initialize favorites and bookmarks from storage
    useEffect(() => {
        initializeFavorites();
        initializeBookmarks();
    }, []);

    // Function to sort stories based on current sort order
    const sortStories = (data) => {
        const dateField = 'createdAt';
        return [...data].sort((a, b) => {
            if (a[dateField] && b[dateField]) {
                // Sort based on sortOrder state
                const dateA = new Date(a[dateField]);
                const dateB = new Date(b[dateField]);
                return sortOrder === 'desc' 
                    ? dateB - dateA  // Newest first
                    : dateA - dateB; // Oldest first
            }
            // If no date field is found, maintain original order
            return 0;
        });
    };

    // Function to toggle sort order
    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newSortOrder);
        // Re-sort the stories with the new sort order
        setStories(sortStories(stories));
    };

    // Central filter toggle function
    const toggleFilter = (filterType) => {
        setActiveFilter(activeFilter === filterType ? null : filterType);
    };

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

                // Sort stories based on current sort order
                const dateField = 'createdAt';
                console.log(`🔍 Using date field: ${dateField}`);

                const sortedData = sortStories(data);

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

    // Filter stories based on activeFilter state
    let filteredStories = stories;

    if (activeFilter === 'favorites') {
        filteredStories = filteredStories.filter(story => isFavorite(story.id || story._id));
    } else if (activeFilter === 'unread') {
        filteredStories = filteredStories.filter(story => !isBookmarked(story.id || story._id));
    }

    return (
        <View style={Styles.container.padded}>
            {/* Filter and Sort Controls */}
            <View style={Styles.layout.filterContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            title={activeFilter === 'favorites' ? "Alle" : "Favoriten"}
                            onPress={() => toggleFilter('favorites')}
                            color={Colors.light.brand}
                        />
                        <View style={{ width: 10 }} />
                        <Button
                            title={activeFilter === 'unread' ? "Alle" : "Ungelesen"}
                            onPress={() => toggleFilter('unread')}
                            color={Colors.light.brand}
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={toggleSortOrder}
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            backgroundColor: Colors.light.brand,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 4
                        }}
                    >
                        <Text style={{ color: 'white', marginRight: 5 }}>
                            {sortOrder === 'desc' ? "Neu" : "Alt"}
                        </Text>
                        <MaterialIcons 
                            name={sortOrder === 'desc' ? "arrow-downward" : "arrow-upward"} 
                            size={16} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>
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

                            {/* Icons container */}
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 5 }}>
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

                                {/* Bookmark icon */}
                                <TouchableOpacity
                                    onPress={() => toggleBookmark(item.id || item._id)}
                                    style={Styles.image.favoriteIcon}>
                                    <MaterialIcons
                                        name={isBookmarked(item.id || item._id) ? "bookmark" : "bookmark-outline"}
                                        size={24}
                                        color={isBookmarked(item.id || item._id) ? "#ba9425" : "gray"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}