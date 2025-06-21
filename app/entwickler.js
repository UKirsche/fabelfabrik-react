import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Styles } from '../constants/Styles';

export default function EntwicklerScreen() {
    return (
        <SafeAreaView style={Styles.container.base}>
            <ScrollView>
                <View style={Styles.container.content}>
                    <Text style={Styles.text.title}>Entwickler</Text>

                    <View style={Styles.container.section}>
                        <Text style={Styles.text.sectionTitle}>Über den Entwickler</Text>

                        <Text style={Styles.text.paragraph}>
                            Dieses unabhängige Projekt wird von einem Psychologen und Softwareentwickler betrieben,
                            der seine Expertise aus beiden Bereichen einbringt.
                        </Text>

                        <Text style={Styles.text.paragraph}>
                            Aus langjähriger Erfahrung weiß er, wie bedeutsam die Förderung von Fantasie und
                            Kreativität für die Entwicklung von Kindern ist. Deshalb steht bei Fabelfabrik die
                            kindgerechte Gestaltung von Geschichten, Bildern und digitalen Erlebnissen im
                            Mittelpunkt.
                        </Text>

                        <Text style={Styles.text.paragraph}>
                            Inspiriert von Michael Ende, der sagte:
                        </Text>
                        <Text style={[Styles.text.paragraph, {fontStyle: 'italic', marginTop: -10}]}>
                            „Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt.&quot;
                        </Text>
                        <Text style={[Styles.text.paragraph, {marginTop: -10}]}>
                            basiert Fabelfabrik auf der Überzeugung, dass Fantasie der Schlüssel für persönliche
                            Entwicklung, Resilienz und Lebensfreude ist.
                        </Text>
                    </View>

                    <View style={Styles.container.section}>
                        <Text style={Styles.text.sectionTitle}>Technische Details</Text>
                        <Text style={Styles.text.paragraph}>
                            Die App wurde mit React Native und Expo entwickelt.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

