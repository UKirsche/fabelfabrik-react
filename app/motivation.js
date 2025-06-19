import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MotivationScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Hintergrund und Motivation</Text>
                
                <Text style={styles.paragraph}>
                    Die Fabelfabrik entstand aus dem Wunsch, Kindern und Eltern eine Plattform zu bieten, 
                    die das gemeinsame Lesen und Erzählen von Geschichten fördert.
                </Text>
                
                <Text style={styles.paragraph}>
                    In einer zunehmend digitalen Welt möchten wir die Fantasie und Kreativität von Kindern 
                    anregen und gleichzeitig die Bindung zwischen Eltern und Kindern durch gemeinsame 
                    Leseerlebnisse stärken.
                </Text>
                
                <Text style={styles.paragraph}>
                    Unsere Geschichten sind sorgfältig gestaltet, um sowohl unterhaltsam als auch lehrreich 
                    zu sein. Sie behandeln verschiedene Themen, die zum Nachdenken anregen und wichtige 
                    Werte vermitteln.
                </Text>
                

                <Text style={styles.paragraph}>
                    Fabelfabrik wird bewusst als Indie-Projekt betrieben, das kontinuierlich wächst und mit Geschichten gefüllt wird.
                    Im Vordergrund steht nicht der Profit,
                    sondern der Wunsch, das eigene Interesse und die Leidenschaft für Kreativität,
                    Fantasie und digitale Innovation weiterzugeben und in eine
                    nachhaltige, inspirierende Plattform zu verwandeln.
                </Text>

                <Text style={styles.paragraph}>
                    Wir freuen uns auf Ihre Anregungen und Feedback!
                </Text>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1d5264',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#333',
    },
});