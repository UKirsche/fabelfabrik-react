import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../config';

export default function StoryListScreen() {
    const [stories, setStories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        console.log('🚀 Loading stories from:', API_BASE_URL);

        fetch(`${API_BASE_URL}/stories`)
            .then((res) => res.json())
            .then((data) => {
                console.log('📚 Total stories loaded:', data.length);

                // Log jede Geschichte einzeln
                data.forEach((story, index) => {
                    console.log(`📖 Story ${index + 1}:`);
                    console.log(`   ID: ${story.id || story._id}`);
                    console.log(`   Title: "${story.title}"`);
                    console.log(`   Content: "${story.content?.substring(0, 50)}..."`);
                    console.log(`   Content Length: ${story.content?.length || 0} characters`);
                });

                setStories(data);
            })
            .catch(err => {
                console.error('❌ Error loading stories:', err);
            });
    }, []);


    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button 
                title="Neue Geschichte" 
                onPress={() => router.push('/stories/create')} 
            />
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
                        }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                        <Text numberOfLines={2}>{item.content}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}