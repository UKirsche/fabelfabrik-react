# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Initialize Gradle

If you need to build the Android app with Gradle, you can initialize Gradle for the project by running:

```bash
npm run init-gradle
```

This command will:
1. Generate the native Android project with Gradle configuration
2. Create the Android directory with all necessary Gradle files
3. Configure the project for building with Gradle

After initializing Gradle, you can:
- Run `cd android && ./gradlew tasks` to see available Gradle tasks
- Run `npm run build:android` to build the Android app using EAS
- Run `npm run android` to start the app in development mode

## Run Configurations

This project includes run configurations for both Visual Studio Code and JetBrains IDEs (like WebStorm or IntelliJ IDEA). These configurations allow you to run various scripts directly from your IDE.

### Visual Studio Code

To use the run configurations in VS Code:

1. Open the project in VS Code
2. Go to the "Run and Debug" panel (Ctrl+Shift+D or Cmd+Shift+D)
3. Select a configuration from the dropdown menu at the top
4. Click the green play button or press F5 to run the selected configuration

Available configurations:
- Start Expo: Starts the Expo development server
- Start Android: Starts the app on Android
- Start iOS: Starts the app on iOS
- Start Web: Starts the app on web
- Build Android: Builds the Android app using EAS
- Build iOS: Builds the iOS app using EAS
- Build Preview: Builds with preview profile
- Build Development: Builds with development profile
- Initialize Gradle: Initializes Gradle for the project

### JetBrains IDEs

To use the run configurations in JetBrains IDEs:

1. Open the project in your IDE
2. Click on the "Run" menu
3. Select "Run..." or use the dropdown in the toolbar
4. Select a configuration from the list

The same configurations are available as in VS Code.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
