import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Image } from 'react-native';
import { API_BASE_URL, IMAGES_BASE_URL } from '../../config';

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
                            <Text numberOfLines={2}>{item.description || item.content}</Text>
                            {item.pageCount && (
                                <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                    {item.pageCount} Seiten
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}