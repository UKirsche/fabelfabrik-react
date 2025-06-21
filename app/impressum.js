import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Styles } from '../constants/Styles';

export default function ImpressumScreen() {
    return (
        <ScrollView style={Styles.container.base}>
            <View style={Styles.container.content}>
                <Text style={Styles.text.title}>Impressum</Text>

                <Text style={Styles.text.sectionTitle}>Angaben gemäß § 5 TMG:</Text>
                <Text style={Styles.text.paragraph}>
                    Uwe Kirschenmann{'\n'}
                    Broichstr.44{'\n'}
                    53227 Bonn{'\n'}
                    Deutschland
                </Text>

                <Text style={Styles.text.paragraph}>
                    E-Mail: ukirschenmann@icloud.com
                </Text>

                <Text style={Styles.text.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</Text>
                <Text style={Styles.text.paragraph}>
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

