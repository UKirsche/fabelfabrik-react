import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    // Responsive dimensions - kleineres Logo für bessere Proportionen
    const isSmallScreen = screenWidth < 400;
    const logoWidth = Math.min(screenWidth * 0.6, 300);
    const logoHeight = logoWidth * 0.67; // Maintain aspect ratio

    return (
        <View style={styles.container}>
            <View style={styles.topContent}>
                <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
                    Mit Fabelfabrik die Fantasie auf Reisen schicken!
                </Text>
                <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
                    Kleine Geschichten zum Einschlafen oder für Zwischendurch für Kinder - und Eltern.
                </Text>
                <Image 
                    source={require('../assets/images/fabelfabrik_logo.png')}
                    style={[
                        styles.logo,
                        {
                            width: logoWidth,
                            height: logoHeight,
                        }
                    ]}
                    resizeMode="contain"
                />
            </View>
            <TouchableOpacity
                style={[styles.button, isSmallScreen && styles.buttonSmall]}
                onPress={() => router.push('/stories')}
            >
                <Text style={[styles.buttonText, isSmallScreen && styles.buttonTextSmall]}>
                    Los gehts
                </Text>
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
        padding: screenWidth < 400 ? 15 : 20,
        paddingTop: 20, // Deutlich reduziert von 50/70 auf 20
        paddingBottom: screenHeight < 700 ? 30 : 40,
    },
    topContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        marginBottom: 20,
        maxWidth: '100%',
        maxHeight: screenHeight * 0.3,
    },
    title: {
        fontSize: screenWidth < 400 ? 18 : 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    titleSmall: {
        fontSize: 16,
        lineHeight: 22,
    },
    subtitle: {
        fontSize: screenWidth < 400 ? 13 : 15,
        color: '#666',
        marginBottom: screenWidth < 400 ? 20 : 25,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    subtitleSmall: {
        fontSize: 12,
        marginBottom: 15,
        lineHeight: 16,
    },
    button: {
        backgroundColor: '#1d5264',
        paddingHorizontal: screenWidth < 400 ? 25 : 30,
        paddingVertical: screenWidth < 400 ? 12 : 15,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 120,
    },
    buttonSmall: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: screenWidth < 400 ? 14 : 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextSmall: {
        fontSize: 14,
    },
});