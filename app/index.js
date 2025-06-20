import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useRouter} from 'expo-router';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    // Logo nimmt fast die gesamte verfügbare Breite ein
    const logoPadding = 10; // Kleines Padding
    const logoWidth = screenWidth - (logoPadding * 2);
    const logoHeight = (screenHeight - 200) / 2; // Hälfte der vorherigen Höhe

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Fantasie auf Reise
            </Text>
            <Text style={styles.subtitle}>
                Geschichten für Kinder und Eltern
            </Text>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/fabelfabrik_logo_test.png')}
                    style={{
                        width: logoWidth,
                        height: logoHeight,
                    }}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.testnoteContainer}>
                <Text style={styles.testnote}>
                    <Text style={{fontWeight: 'bold'}}>Hinweis:</Text> Diese App befindet sich in einer frühen
                    Testphase. Das Backend braucht manchmal einen Moment zum Hochfahren.
                </Text>
            </View>

            {/* Spacer für zusätzlichen Abstand */}
            <View style={styles.spacer}/>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/stories')}
            >
                <Text style={styles.buttonText}>
                    Los gehts
                </Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: screenWidth < 400 ? 24 : 26,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    subtitle: {
        fontSize: screenWidth < 400 ? 18 : 20,
        color: '#666',
        marginBottom: 10,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    logoContainer: {
        flex: 0.8, // Hälfte des verfügbaren Platzes
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: screenHeight * 0.05, // 5% der Bildschirmhöhe
        width: '100%',
    },
    spacer: {
        flex: 0.3, // Zusätzlicher Platz unter dem Logo
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
        textAlign: 'center',
    },
    testnoteContainer: {
        backgroundColor: '#f0f0f0',  // Hellgrau
        borderRadius: 12,
        marginTop: screenHeight * 0.08, // 5% der Bildschirmhöhe
        width: '90%',
    },
    testnote: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
});