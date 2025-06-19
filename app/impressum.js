import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ImpressumScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Impressum</Text>
                
                <Text style={styles.sectionTitle}>Angaben gemäß § 5 TMG:</Text>
                <Text style={styles.paragraph}>
                    Uwe Kirschenmann{'\n'}
                    Broichstr.44{'\n'}
                    53227 Bonn{'\n'}
                    Deutschland
                </Text>
                
                <Text style={styles.paragraph}>
                    E-Mail: ukirschenmann@icloud.com
                </Text>
                
                <Text style={styles.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</Text>
                <Text style={styles.paragraph}>
                    Uwe Kirschenmann{'\n'}
                    Broichstr.44{'\n'}
                    53227 Bonn{'\n'}
                    Deutschland
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
        marginTop: 15,
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