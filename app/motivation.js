import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Styles } from '../constants/Styles';

export default function MotivationScreen() {
    return (
        <ScrollView style={Styles.container.base}>
            <View style={Styles.container.content}>
                <Text style={Styles.text.title}>Hintergrund und Motivation</Text>

                <Text style={Styles.text.paragraph}>
                    Die Fabelfabrik entstand aus dem Wunsch, Kindern und Eltern eine Plattform zu bieten, 
                    die das gemeinsame Lesen und Erzählen von Geschichten fördert.
                </Text>

                <Text style={Styles.text.paragraph}>
                    In einer zunehmend digitalen Welt möchten wir die Fantasie und Kreativität von Kindern 
                    anregen und gleichzeitig die Bindung zwischen Eltern und Kindern durch gemeinsame 
                    Leseerlebnisse stärken.
                </Text>

                <Text style={Styles.text.paragraph}>
                    Unsere Geschichten sind sorgfältig gestaltet, um sowohl unterhaltsam als auch lehrreich 
                    zu sein. Sie behandeln verschiedene Themen, die zum Nachdenken anregen und wichtige 
                    Werte vermitteln.
                </Text>


                <Text style={Styles.text.paragraph}>
                    Fabelfabrik wird bewusst als Indie-Projekt betrieben, das kontinuierlich wächst und mit Geschichten gefüllt wird.
                    Im Vordergrund steht nicht der Profit,
                    sondern der Wunsch, das eigene Interesse und die Leidenschaft für Kreativität,
                    Fantasie und digitale Innovation weiterzugeben und in eine
                    nachhaltige, inspirierende Plattform zu verwandeln.
                </Text>

                <Text style={Styles.text.paragraph}>
                    Wir freuen uns auf Ihre Anregungen und Feedback!
                </Text>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
}

