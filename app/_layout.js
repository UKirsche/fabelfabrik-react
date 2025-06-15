
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#ffffff',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            title: 'Fabelfabrik Home',
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
