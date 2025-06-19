import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.topContent}>
                <Text style={styles.title}>Mit Fabelfabrik die Fantasie auf Reisen schicken!</Text>
                <Text style={styles.subtitle}>Kleine Geschichten zum Einschlafen oder für Zwischendurch für Kinder - und Eltern.</Text>
                <Image 
                    source={require('../assets/images/fabelfabrik_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/stories')}
            >
                <Text style={styles.buttonText}>Los gehts</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 80,
    },
    topContent: {
        alignItems: 'center',
    },
    logo: {
        width: 600,
        height: 400,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1d5264',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});