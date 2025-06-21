/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const brandColor = '#1d5264';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    brand: brandColor,
    secondaryText: '#666',
    paragraphText: '#333',
    lightGray: '#f0f0f0',
    border: '#eee',
    activeBackground: '#f0f8ff',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    brand: brandColor,
    secondaryText: '#9BA1A6',
    paragraphText: '#CCCCCC',
    lightGray: '#2A2D2E',
    border: '#2A2D2E',
    activeBackground: '#2A3A45',
  },
};
