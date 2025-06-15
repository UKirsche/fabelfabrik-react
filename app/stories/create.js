import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../config';

export default function StoryCreateScreen() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const saveStory = async () => {
        if (!title || !content) {
            Alert.alert('Bitte Titel und Inhalt angeben!');
            return;
        }
        setSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/stories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
                });
            if (response.ok) {
                setTitle('');
                setContent('');
                router.back();
            } else {
                Alert.alert('Fehler beim Speichern');
            }
        } catch (e) {
            Alert.alert('Netzwerkfehler');
        }
        setSaving(false);
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Titel:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={title}
                onChangeText={setTitle}
                placeholder="Titel der Geschichte"
            />
            <Text>Inhalt:</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5, minHeight: 100 }}
                value={content}
                onChangeText={setContent}
                placeholder="Erzähl deine Geschichte..."
                multiline
            />
            <Button title={saving ? 'Speichert...' : 'Speichern'} onPress={saveStory} disabled={saving} />
        </View>
    );
}