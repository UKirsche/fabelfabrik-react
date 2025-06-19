
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import HamburgerMenu from '../components/HamburgerMenu';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#1d5264',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerLeft: () => (
                            <View style={{ marginLeft: 10 }}>
                                <HamburgerMenu />
                            </View>
                        ),
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            title: 'Fabelfabrik - Vorlesen und Erzählen!',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="stories"
                        options={{
                            title: 'Geschichten',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="stories/[id]"
                        options={{
                            title: 'Geschichte Details',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="stories/create"
                        options={{
                            title: 'Neue Geschichte',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="motivation"
                        options={{
                            title: 'Hintergrund und Motivation',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="rechte_ki"
                        options={{
                            title: 'KI und Rechtliches',
                            headerShown: true
                        }}
                    />
                    <Stack.Screen
                        name="entwickler"
                        options={{
                            title: 'Entwickler',
                            headerShown: true
                        }}
                    />
                </Stack>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
