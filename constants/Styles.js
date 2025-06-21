import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Common text styles
const text = {
  title: {
    fontSize: screenWidth < 400 ? 24 : 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.brand,
  },
  subtitle: {
    fontSize: screenWidth < 400 ? 18 : 20,
    color: Colors.light.secondaryText,
    marginBottom: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: Colors.light.paragraphText,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: Colors.light.brand,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.brand,
  },
  menuItem: {
    fontSize: 12,
    color: Colors.light.paragraphText,
  },
  activeMenuItem: {
    color: Colors.light.brand,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
  storyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  storyDescription: {
    color: Colors.light.secondaryText,
  },
  testnote: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
};

// Common container styles
const container = {
  base: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padded: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  section: {
    marginBottom: 20,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * 0.05,
    width: '100%',
  },
  testnoteContainer: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    marginTop: screenHeight * 0.08,
    width: '90%',
  },
  storyItem: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyContent: {
    flex: 1,
  },
};

// Common button styles
const button = {
  primary: {
    backgroundColor: Colors.light.brand,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
};

// Common layout elements
const layout = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 0.3,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
};

// Menu specific styles
const menu = {
  container: {
    zIndex: 1000,
  },
  button: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '70%',
    height: '100%',
    backgroundColor: Colors.light.background,
  },
  menu: {
    flex: 1,
    padding: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  activeMenuItem: {
    backgroundColor: Colors.light.activeBackground,
  },
};

// Image styles
const image = {
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  favoriteIcon: {
    padding: 8,
    marginLeft: 5,
  },
};

// Story detail styles
const storyDetail = {
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  coverImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  mediaContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  pdfButton: {
    backgroundColor: '#1d5264',
    padding: 10,
    borderRadius: 8,
  },
  pdfButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  audioContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  audioButton: {
    backgroundColor: '#1d5264',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#970937',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  videoContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  videoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ttsFileContainer: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  ttsFileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  ttsFileButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  ttsFileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth - 40,
    height: screenHeight - 100,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// Export all styles
export const Styles = {
  text,
  container,
  button,
  layout,
  menu,
  image,
  storyDetail,
  // Helper function to get responsive dimensions
  getDimensions: () => ({
    screenWidth,
    screenHeight,
  }),
};

// Export a StyleSheet creator function that uses the theme
export const createThemedStyles = (styleCreator) => {
  return StyleSheet.create(styleCreator(Colors.light));
};
