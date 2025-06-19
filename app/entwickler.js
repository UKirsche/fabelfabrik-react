import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function EntwicklerScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.title}>Entwickler</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Über den Entwickler</Text>

                        <Text style={styles.paragraph}>
                            Dieses unabhängige Projekt wird von einem Psychologen und Softwareentwickler betrieben,
                            der seine Expertise aus beiden Bereichen einbringt.
                        </Text>

                        <Text style={styles.paragraph}>
                            Aus langjähriger Erfahrung weiß er, wie bedeutsam die Förderung von Fantasie und
                            Kreativität für die Entwicklung von Kindern ist. Deshalb steht bei Fabelfabrik die
                            kindgerechte Gestaltung von Geschichten, Bildern und digitalen Erlebnissen im
                            Mittelpunkt.
                        </Text>

                        <Text style={styles.paragraph}>
                            Inspiriert von Michael Ende, der sagte:
                        </Text>
                        <Text style={[styles.paragraph, {fontStyle: 'italic', marginTop: -10}]}>
                            „Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.&quot;
                        </Text>
                        <Text style={[styles.paragraph, {marginTop: -10}]}>
                            basiert Fabelfabrik auf der Überzeugung, dass Fantasie der Schlüssel für persönliche
                            Entwicklung, Resilienz und Lebensfreude ist.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Technische Details</Text>
                        <Text style={styles.paragraph}>
                            Die App wurde mit React Native und Expo entwickelt.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1d5264',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1d5264',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#333',
    },
});
