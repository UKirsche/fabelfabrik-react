import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RechteKiScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>KI und Rechtliches</Text>
                
                <Text style={styles.sectionTitle}>Einsatz von Künstlicher Intelligenz</Text>
                <Text style={styles.paragraph}>
                    Bei der Fabelfabrik nutzen wir moderne KI-Technologien, um kreative und 
                    pädagogisch wertvolle Geschichten zu erstellen. Unsere KI-Systeme werden 
                    sorgfältig trainiert und überwacht, um qualitativ hochwertige Inhalte zu gewährleisten.
                </Text>
                
                <Text style={styles.paragraph}>
                    Alle durch KI generierten Inhalte werden von unserem Team überprüft, 
                    um sicherzustellen, dass sie unseren Qualitätsstandards entsprechen und 
                    für Kinder geeignet sind.
                </Text>
                
                <Text style={styles.sectionTitle}>Urheberrecht und Nutzungsrechte</Text>
                <Text style={styles.paragraph}>
                    Die in der Fabelfabrik verfügbaren Geschichten unterliegen dem Urheberrecht. 
                    Die Nutzung ist ausschließlich für private, nicht-kommerzielle Zwecke gestattet.
                </Text>
                
                <Text style={styles.paragraph}>
                    Das Teilen, Reproduzieren oder Veröffentlichen unserer Inhalte ohne ausdrückliche 
                    Genehmigung ist nicht gestattet. Bei Fragen zu Nutzungsrechten kontaktieren Sie 
                    bitte unser Team.
                </Text>
                
                <Text style={styles.sectionTitle}>Datenschutz</Text>
                <Text style={styles.paragraph}>
                    Der Schutz Ihrer Daten und der Daten Ihrer Kinder ist uns wichtig. 
                    Wir erheben nur die notwendigsten Daten und behandeln diese vertraulich 
                    gemäß unserer Datenschutzrichtlinien und den geltenden Gesetzen.
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#1d5264',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#333',
    },
});