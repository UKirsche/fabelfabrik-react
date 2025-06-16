# Fabelfabrik React

## Audio Player Implementation

An MP3 player has been added to the story detail page (`app/stories/[id].js`). This player allows users to:
- Play/pause audio files
- See playback progress
- Download MP3 files

### Required Dependencies

To use the audio player functionality, you need to install the following dependency:

```bash
npx expo install expo-av
```

### How It Works

The audio player uses the `expo-av` library to handle audio playback. It connects to the backend API using the `AUDIO_BASE_URL` defined in `config.js`.

The player will appear on the story detail page when a story has an `audioUrl` property. The audio file can be played directly in the app or downloaded to the device.

### Implementation Details

- Audio playback state is managed with React hooks
- Progress tracking is implemented with an interval that updates during playback
- The player automatically cleans up resources when the component unmounts
- The download button uses the device's default browser or download manager

### Troubleshooting

If you encounter issues with the audio player:

1. Make sure `expo-av` is properly installed
2. Check that the backend API is serving audio files correctly
3. Verify that the story object has a valid `audioUrl` property
4. Ensure the `AUDIO_BASE_URL` in `config.js` points to the correct endpoint