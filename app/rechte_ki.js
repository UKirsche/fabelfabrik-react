import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Styles } from '../constants/Styles';

export default function RechteKiScreen() {
    return (
        <ScrollView style={Styles.container.base}>
            <View style={Styles.container.content}>
                <Text style={Styles.text.title}>KI und Rechtliches</Text>

                <Text style={Styles.text.sectionTitle}>Einsatz von Künstlicher Intelligenz</Text>
                <Text style={Styles.text.paragraph}>
                    Bei der Fabelfabrik nutzen wir moderne KI-Technologien, um kreative und 
                    pädagogisch wertvolle Geschichten zu erstellen. Unsere KI-Systeme werden 
                    sorgfältig trainiert und überwacht, um qualitativ hochwertige Inhalte zu gewährleisten.
                </Text>

                <Text style={Styles.text.paragraph}>
                    Alle durch KI generierten Inhalte werden von unserem Team überprüft, 
                    um sicherzustellen, dass sie unseren Qualitätsstandards entsprechen und 
                    für Kinder geeignet sind.
                </Text>

                <Text style={Styles.text.sectionTitle}>Urheberrecht und Nutzungsrechte</Text>
                <Text style={Styles.text.paragraph}>
                    Die in der Fabelfabrik verfügbaren Geschichten unterliegen dem Urheberrecht. 
                    Die Nutzung ist ausschließlich für private, nicht-kommerzielle Zwecke gestattet.
                </Text>

                <Text style={Styles.text.paragraph}>
                    Das Teilen, Reproduzieren oder Veröffentlichen unserer Inhalte ohne ausdrückliche 
                    Genehmigung ist nicht gestattet. Bei Fragen zu Nutzungsrechten kontaktieren Sie 
                    bitte unser Team.
                </Text>

                <Text style={Styles.text.sectionTitle}>Datenschutz</Text>
                <Text style={Styles.text.paragraph}>
                    Der Schutz Ihrer Daten und der Daten Ihrer Kinder ist uns wichtig. 
                    Wir erheben nur die notwendigsten Daten und behandeln diese vertraulich 
                    gemäß unserer Datenschutzrichtlinien und den geltenden Gesetzen.
                </Text>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
}

