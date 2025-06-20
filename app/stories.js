import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL, IMAGES_BASE_URL } from '../config';

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
        <View style={{ flex: 1, padding: 16 }}>
            {/*<Button */}
            {/*    title="Neue Geschichte" */}
            {/*    onPress={() => router.push('/stories/create')} */}
            {/*/>*/}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{ marginTop: 10, textAlign: 'center' }}>
                        Der Server wacht auf… bitte einen Moment Geduld.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={stories}
                    keyExtractor={(item) => item.id || item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/stories/${item.id || item._id}`)}
                            style={{
                                marginVertical: 8,
                                padding: 12,
                                borderWidth: 1,
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {item.coverImageUrl && (
                                <Image
                                    source={{ uri: `${IMAGES_BASE_URL}/${item.coverImageUrl}` }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        marginRight: 12,
                                    }}
                                    resizeMode="cover"
                                />
                            )}
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                                <Text numberOfLines={2}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
