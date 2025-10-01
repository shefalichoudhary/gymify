# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

## Instructions to run on your development machine

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the Expo development server**

   ```bash
   npx expo start
   ```

3. **Choose your platform**

   - Android emulator (start from Android Studio)
   - iOS simulator (requires macOS)
   - Expo Go app on your mobile device (scan the QR code)
   - Development build

> **Tip:** For Android, you may need to start an emulator from Android Studio first.

---

### Seeding the database

- The local SQLite database is seeded automatically with exercises and muscles when the app starts.
- To manually trigger seeding, call the `SeedDatabase` function from `db/seed.tsx` in your code.

Example (already included in `app/index.tsx`):

```tsx
import { SeedDatabase } from "../db/seed";

useEffect(() => {
  const runSeed = async () => {
    await SeedDatabase();
  };
  runSeed();
}, []);
```

### Build a development standalone app (EAS)

To build a development version for Android or iOS:

```bash
npx eas build -p android --profile development   # for Android
npx eas build -p ios --profile development       # for iOS
```

---

## Development Process for Dev Development

Follow these steps to run and develop the app locally:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Prepare your device or emulator**

   - **Android:** Start an emulator from Android Studio before running the app.
   - **iOS:** Use the simulator (requires macOS).
   - **Physical device:** Install the Expo Go app and scan the QR code.

3. **Start the Expo development server**

   ```bash
   npx expo start
   ```

   - This starts the Metro bundler in your terminal or VS Code.
   - You can edit code in the app directory and hot reload will reflect changes immediately.

4. **Choose your platform in the Expo CLI**

   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan the QR code for Expo Go

5. **Install the app on your device or simulator**

   - After the build, install the APK (Android) or IPA (iOS) on your device or emulator.

6. **Keep the Metro bundler running**

   - The app connects to the dev server for live reload and debugging.
   - Any code changes in VS Code will hot reload in your installed dev build.

7. **Debug and test**

   - Use console logs or React Native Debugger to inspect the app.
   - Seed the database as needed during development (see instructions above).
   - Commit changes frequently and push to your repository.

---



> **Tip:** For Android, you may need to start an emulator from Android Studio first before running the app in development mode.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
