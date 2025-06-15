import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoryListScreen from './src/screens/StoryListScreen';
import StoryDetailScreen from './src/screens/StoryDetailScreen';
import StoryCreateScreen from './src/screens/StoryCreateScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator id={(route) => route.name}>
                <Stack.Screen name="Geschichten" component={StoryListScreen} />
                <Stack.Screen name="Story" component={StoryDetailScreen} />
                <Stack.Screen name="Neu" component={StoryCreateScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}