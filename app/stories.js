import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL, IMAGES_BASE_URL } from '../config';
import { Styles } from '../constants/Styles';
import { Colors } from '../constants/Colors';

export default function StoryListScreen() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                });

                setStories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error loading stories:', err);
                setLoading(false);
            });
    }, []);


    return (
        <View style={Styles.container.padded}>
            {/*<Button */}
            {/*    title="Neue Geschichte" */}
            {/*    onPress={() => router.push('/stories/create')} */}
            {/*/>*/}
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
                    data={stories}
                    keyExtractor={(item) => item.id || item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/stories/${item.id || item._id}`)}
                            style={Styles.container.storyItem}>
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
                    )}
                />
            )}
        </View>
    );
}
