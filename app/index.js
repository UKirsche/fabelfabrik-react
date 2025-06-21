import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useRouter} from 'expo-router';
import { Styles } from '../constants/Styles';

const {screenWidth, screenHeight} = Styles.getDimensions();

export default function HomeScreen() {
    const router = useRouter();

    // Logo nimmt fast die gesamte verfügbare Breite ein
    const logoPadding = 10; // Kleines Padding
    const logoWidth = screenWidth - (logoPadding * 2);
    const logoHeight = (screenHeight - 200) / 2; // Hälfte der vorherigen Höhe

    return (
        <View style={Styles.container.homeContainer}>
            <Text style={Styles.text.title}>
                Fantasie auf Reise
            </Text>
            <Text style={Styles.text.subtitle}>
                Geschichten für Kinder und Eltern
            </Text>

            <View style={Styles.container.logoContainer}>
                <Image
                    source={require('../assets/images/fabelfabrik_logo_test.png')}
                    style={{
                        width: logoWidth,
                        height: logoHeight,
                    }}
                    resizeMode="contain"
                />
            </View>

            <View style={Styles.container.testnoteContainer}>
                <Text style={Styles.text.testnote}>
                    <Text style={{fontWeight: 'bold'}}>Hinweis:</Text> Diese App befindet sich in einer frühen
                    Testphase. Das Backend braucht manchmal einen Moment zum Hochfahren.
                </Text>
            </View>

            {/* Spacer für zusätzlichen Abstand */}
            <View style={Styles.layout.spacer}/>

            <TouchableOpacity
                style={Styles.button.primary}
                onPress={() => router.push('/stories')}
            >
                <Text style={Styles.text.buttonText}>
                    Los gehts
                </Text>
            </TouchableOpacity>
            <StatusBar style="auto"/>
        </View>
    );
}

