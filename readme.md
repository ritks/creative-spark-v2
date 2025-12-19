# Creative Spark - MVP Technical Documentation

## Overview
Creative Spark is a mobile app that helps users recapture their creativity through daily prompts and on-demand inspiration. Built with React Native (Expo) for cross-platform iOS and Android support.

## Core Features (MVP)
1. **Onboarding & Interest Selection** - Users choose activity categories to personalize prompts
2. **Daily Prompt System** - One curated prompt per day based on interests
3. **On-Demand Prompts** - Context-filtered prompts based on location and group size
4. **Journal System** - Private and public entries with photos and notes

## Architecture

### Tech Stack
- **Framework**: React Native with Expo SDK 50+
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Storage**: AsyncStorage (local persistence)
- **Image Handling**: expo-image-picker

### Project Structure
```
creative-spark/
├── app/
│   ├── _layout.js              # Root layout with AppProvider
│   ├── index.js                # Entry point & routing logic
│   ├── onboarding.js           # Interest selection
│   ├── (tabs)/
│   │   ├── _layout.js          # Tab navigation
│   │   ├── home.js             # Daily prompt screen
│   │   ├── prompts.js          # On-demand prompts
│   │   ├── journal.js          # Journal list
│   │   └── settings.js         # Settings & interest management
│   └── journal/
│       ├── new.js              # Create journal entry
│       └── [id].js             # Journal entry detail
├── contexts/
│   └── AppContext.js           # Global state management
├── data/
│   └── prompts.js              # Prompt database & filtering
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```

### Key Design Decisions

#### 1. Context API over Redux
**Why**: For MVP scope (simple state, no async middleware needed), Context API provides clean global state without Redux boilerplate. Easy to migrate to Redux/Zustand if complexity grows.

#### 2. AsyncStorage for Persistence
**Why**: Built-in, simple key-value storage perfect for MVP. All data stored locally on device. Future: Can migrate to SQLite or remote backend.

#### 3. Expo Router over React Navigation
**Why**: File-based routing is more intuitive and reduces boilerplate. Built-in support for dynamic routes (`[id].js`) and tab navigation.

#### 4. Prompt Filtering Architecture
**Why**: Each prompt has metadata (location, group size, category). This allows context-aware filtering without complex algorithms. Scalable to 100+ prompts.

#### 5. No Backend in MVP
**Why**: Keeps initial development simple. All data stored locally. Future iterations can add:
- User authentication
- Cloud sync
- Social features (friend system, trending prompts)

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for emulators)
- Physical device with Expo Go app (optional)

### Setup Steps

1. **Create project directory**
```bash
mkdir creative-spark
cd creative-spark
```

2. **Initialize Expo project**
```bash
npx create-expo-app@latest . --template blank
```

3. **Install dependencies**
```bash
npm install expo-router@~3.4.0 react-native-safe-area-context@4.8.0 react-native-screens@~3.29.0 @react-native-async-storage/async-storage@1.21.0 expo-image-picker@~14.7.0
```

4. **Update package.json**
Replace the `"main"` field with:
```json
"main": "expo-router/entry"
```

5. **Create file structure**
```bash
mkdir -p app/\(tabs\) app/journal contexts data
```

6. **Copy all provided files** into their respective directories

7. **Create placeholder assets**
```bash
mkdir assets
# Add icon.png, splash.png, adaptive-icon.png, favicon.png
# Or use default Expo assets temporarily
```

8. **Start development server**
```bash
npx expo start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator  
- `w` for web (limited functionality)
- Scan QR code with Expo Go app for physical device

## Data Models

### User Interests
```javascript
// Array of category strings
interests: ['art', 'photography', 'nature']
```

### Prompt Structure
```javascript
{
  id: 'art_1',
  category: 'art',
  text: 'Draw a doodle of the view outside your window',
  location: ['home'],
  groupSize: ['solo'],
  difficulty: 'easy'
}
```

### Journal Entry
```javascript
{
  id: '1702947281234',  // Timestamp
  promptId: 'art_1',
  promptText: 'Draw a doodle...',
  notes: 'Had fun with this!',
  photoUri: 'file://...',
  isPublic: false,
  createdAt: '2024-12-18T10:30:00.000Z'
}
```

## Key Flows

### First-Time User Flow
1. App loads → Index checks `hasCompletedOnboarding` → False
2. Navigate to `/onboarding`
3. User selects interests
4. Save to AsyncStorage, set `hasCompletedOnboarding: true`
5. Navigate to `/(tabs)/home`

### Daily Prompt Flow
1. Home screen loads
2. Check if `lastPromptDate` != today's date
3. If new day: Generate random prompt from user's interests
4. Display prompt with metadata
5. User clicks "Complete & Journal" → Navigate to `/journal/new` with prompt params
6. User creates entry → Save to AsyncStorage
7. Navigate to `/(tabs)/journal`

### On-Demand Prompt Flow
1. User selects location and group size filters
2. Clicks "Generate Prompt"
3. Filter prompts by interests + context
4. Display random prompt from filtered results
5. User can complete or regenerate

## Future Enhancements (Post-MVP)

### Near-Term (v1.1)
- [ ] Streak tracking (consecutive days completed)
- [ ] Prompt difficulty preference
- [ ] Dark mode support
- [ ] Export journal as PDF

### Medium-Term (v1.2)
- [ ] Friend system (add/invite friends)
- [ ] View friends' public entries
- [ ] Trending prompts feed
- [ ] Push notifications for daily prompts

### Long-Term (v2.0)
- [ ] User authentication (Firebase/Supabase)
- [ ] Cloud sync across devices
- [ ] ML model for personalized prompts
- [ ] Community challenges/themes
- [ ] Premium prompts subscription

## Development Notes

### Adding New Prompts
Edit `data/prompts.js`:
```javascript
{
  id: 'unique_id',
  category: CATEGORIES.ART,
  text: 'Your prompt text',
  location: [LOCATIONS.HOME, LOCATIONS.PUBLIC],
  groupSize: [GROUP_SIZES.SOLO],
  difficulty: 'easy'
}
```

### Modifying Interests
Edit `CATEGORY_OPTIONS` in:
- `app/onboarding.js`
- `app/(tabs)/settings.js`
- Add to `CATEGORIES` in `data/prompts.js`

### Debugging Storage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// View all keys
AsyncStorage.getAllKeys().then(keys => console.log(keys));

// Clear storage (reset app)
AsyncStorage.clear();
```

## Testing Strategy

### Manual Testing Checklist
- [ ] New user onboarding flow
- [ ] Daily prompt generates at midnight
- [ ] On-demand prompt filtering works correctly
- [ ] Journal entry creation with photo
- [ ] Public/private visibility toggle
- [ ] Interest changes reflect in prompts
- [ ] Delete entry confirmation
- [ ] App state persists after restart

### Device Testing
- [ ] iOS (iPhone SE, iPhone 14 Pro)
- [ ] Android (Pixel, Samsung)
- [ ] Tablet layouts (iPad, Android tablet)

## Performance Considerations

1. **Image Optimization**: Photos compressed to 0.8 quality via expo-image-picker
2. **List Rendering**: Journal uses ScrollView (fine for MVP <100 entries). Migrate to FlatList for 1000+ entries
3. **Storage Size**: AsyncStorage limit ~6MB on Android, ~10MB on iOS. Sufficient for MVP. Monitor entry count.

## Deployment

### Build for Production

**iOS**
```bash
npx expo build:ios
# Follow prompts for Apple Developer account
```

**Android**
```bash
npx expo build:android
# Generates APK or AAB for Google Play
```

### Over-the-Air Updates
```bash
npx expo publish
# Push updates without app store review (JS/assets only)
```

## Support & Maintenance

### Common Issues

**Issue**: AsyncStorage not persisting
- **Fix**: Check permissions in app.json
- **Fix**: Verify AsyncStorage import path

**Issue**: Image picker not working
- **Fix**: Ensure permissions in app.json (iOS Info.plist)
- **Fix**: Test on physical device (simulators have limited camera access)

**Issue**: Prompts not showing
- **Fix**: Verify user has selected interests in onboarding
- **Fix**: Check `data/prompts.js` has prompts for selected categories

## License
MIT License - Feel free to use this codebase for your projects.

## Contact
For questions or contributions, reach out to the development team.
