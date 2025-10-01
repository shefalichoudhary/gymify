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


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
