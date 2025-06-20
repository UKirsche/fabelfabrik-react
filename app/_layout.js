import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import HamburgerMenu from '../components/HamburgerMenu';


export default function RootLayout() {
    const router = useRouter();
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
                            fontSize: 12,  // Reduziert die Header-Titel-Schriftgröße
                        },
                        headerLeft: () => (
                            <View style={styles.headerLeftContainer}>
                                <HamburgerMenu />
                            </View>
                        ),
                        headerRight: () => (
                            <TouchableOpacity 
                                style={styles.headerRightContainer}
                                onPress={() => router.push('/stories')}
                                activeOpacity={0.7}
                            >
                                <Image 
                                    source={require('../assets/images/fabelfabrik_logo_klein.png')}
                                    style={styles.headerLogo}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ),
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            title: 'Vorlesen und Erzählen!',
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
    headerLeftContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRightContainer: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
});