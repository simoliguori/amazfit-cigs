# amazfit-cigs

Daily cigarette counter for Amazfit smartwatches & Android.

Track how many cigarettes you smoke each day, get roasted by motivational quotes, and review your 14-day history — all from your wrist.

## Features

- **One-tap tracking** — tap to log a cigarette
- **Daily counter** with auto-reset based on configurable end-of-day hour
- **14-day history** with bar chart and per-day average time between cigarettes
- **Edit past days** — tap any day in history to adjust the count
- **Motivational quotes** — 30 rotating quotes that shame you into quitting (in English and Italian)
- **Bilingual** — English (default) and Italian
- **Android companion app** — same UI, synced via Firebase Realtime Database
- **Configurable day boundary** — set when your "day" ends (e.g. 4 AM for night owls)

## Screenshots

### Watch
| Home | History | Settings |
|------|---------|----------|
| Counter + quote + last cigarette timer | 14-day log with avg intervals | Language, end-of-day, credits |

### Android
Same UI adapted for phone screens, with real-time Firebase sync.

## Watch App (Zepp OS)

Built for **Amazfit Active 2 Square** running Zepp OS 4.0.

### Requirements

- [Node.js](https://nodejs.org/)
- Zeus CLI: `npm install -g @zeppos/zeus-cli`
- [Zepp OS Simulator](https://developer.zepp.com/) (optional, for testing)

### Development

```bash
cd "amazfit sigarette"
zeus dev
```

### Install on watch

```bash
zeus bridge
# In the bridge prompt:
connect
install
```

### Project structure

```
app.js              — app lifecycle, data storage, day logic
page/index.js       — home screen (counter, buttons, quote)
page/history.js     — 14-day history with averages
page/edit.js        — edit a specific day's count
page/settings.js    — language, end-of-day hour, credits
lib/i18n.js         — translation strings (en/it)
app.json            — app config, permissions, page registry
```

## Android App

Web app wrapped with [Capacitor](https://capacitorjs.com/) for native APK generation.

### Requirements

- Node.js
- [Android Studio](https://developer.android.com/studio) (for APK build)

### Setup

```bash
cd android
npm install
npm run build
npx cap init Sigarette com.eccerobot.sigarette --web-dir dist
npx cap add android
npx cap sync
npx cap open android
```

Then build the APK from Android Studio: **Build → Build APK(s)**.

### Firebase Sync

The Android app syncs data via Firebase Realtime Database. To use your own Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** in test mode
3. Register a web app and copy the config
4. Update `android/src/firebase.js` with your `firebaseConfig`

## Tech Stack

- **Watch**: Zepp OS 4.0 API, JavaScript (QuickJS)
- **Android**: Vite, Capacitor, Firebase Realtime Database
- **Language**: JavaScript (ES5-compatible for watch, ES modules for Android)

## Credits

Built by [eccerobot.xyz](https://eccerobot.xyz)

## License

MIT
