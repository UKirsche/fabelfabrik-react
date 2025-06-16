import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';

import { API_BASE_URL, IMAGES_BASE_URL, PDF_BASE_URL } from '../../config';

export default function StoryDetailScreen({ route }) {
    const { id } = route.params;
    const [story, setStory] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stories/${id}`)
            .then((res) => res.json())
            .then((data) => setStory(data));
    }, [id]);

    if (!story) return <Text>Lädt...</Text>;

    const openPDF = () => {
        if (story.pdfUrl) {
            Linking.openURL(`${PDF_BASE_URL}/${story.pdfUrl}`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{story.title}</Text>

            <View style={styles.mediaContainer}>
                {story.coverImageUrl && (
                    <Image
                        source={{ uri: `${IMAGES_BASE_URL}/${story.coverImageUrl}` }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
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

            <Text style={styles.content}>{story.content}</Text>
        </ScrollView>
    );
}

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
        alignItems: 'center',
        marginBottom: 16,
    },
    coverImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 16,
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
    },
});
