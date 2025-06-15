import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

import { API_BASE_URL } from '../../config'; // Pfad ggf. anpassen!
fetch(`${API_BASE_URL}/stories`)

export default function StoryDetailScreen({ route }) {
    const { id } = route.params;
    const [story, setStory] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/${id}`)
            .then((res) => res.json())
            .then((data) => setStory(data));
    }, [id]);

    if (!story) return <Text>Lädt...</Text>;

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{story.title}</Text>
            <Text style={{ marginVertical: 10 }}>{story.content}</Text>
            {story.images && story.images.length > 0 &&
                story.images.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={{ width: '100%', height: 200, marginVertical: 8 }} />
                ))
            }
            {story.audio &&
                <Text style={{ color: 'blue', marginTop: 10 }}>Audio: {story.audio}</Text>
                // Für echtes Audio-Playback kannst du expo-av verwenden.
            }
        </ScrollView>
    );
}