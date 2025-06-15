import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../../config';

export default function StoryListScreen({ navigation }) {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stories`)
            .then((res) => res.json())
            .then((data) => setStories(data));
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button title="Neue Geschichte" onPress={() => navigation.navigate('Neu')} />
            <FlatList
                data={stories}
                keyExtractor={(item) => item.id || item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Story', { id: item.id || item._id })}
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