# Expense Tracker (Expo + Firebase)

This app now supports real transaction data with Firestore.

## 1. Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your Firebase values:

```bash
cp .env.example .env
```

Required variables:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Optional:

- `EXPO_PUBLIC_USER_NAME`
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

Run the app:

```bash
npx expo start
```

## 2. Firebase setup for real data

1. Create a Firebase project.
2. Enable Authentication -> Sign-in method -> Anonymous.
3. Create a Firestore database.
4. Deploy Firestore rules from `firestore.rules`.

This app stores transactions under:

`users/{uid}/transactions/{transactionId}`

where `uid` is the anonymous Firebase auth user id.

## 3. Deploy the app (production build)

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login and configure:

```bash
eas login
eas build:configure
```

3. Build Android app bundle:

```bash
eas build -p android --profile production
```

4. Build iOS app:

```bash
eas build -p ios --profile production
```

Before production release, ensure:

- Firebase API keys are set in EAS secrets or env variables.
- Firestore rules are deployed.
- Cloudinary env values are set (if using avatar upload).

## 4. Troubleshooting

- If Expo tunnel fails, use `npx expo start --host lan` on same Wi-Fi.
- If Android says `TypeError: fetch failed` while opening Expo Go, install Expo Go on emulator/device first, then open the `exp://` URL manually.
