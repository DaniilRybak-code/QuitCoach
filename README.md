# QuitCard Arena - Vaping Cessation App

A gamified vaping cessation app with trading card mechanics, battle arena, and progress tracking.

## ✨ New Features

### 🎯 Complete Onboarding Flow
- **3-Step Setup Process**: Hero name → Archetype selection → Avatar creation
- **Progress Tracking**: Visual progress bar with step indicators
- **Data Persistence**: User data saved to local storage

### 🎨 Avatar Generation System
- **Primary**: DiceBear API integration for anime-style avatars
- **Fallback**: Local SVG generation with colored initials
- **Error Handling**: Automatic fallback if external API fails
- **Customization**: Generate new avatars with different seeds

### 🔄 User State Management
- **Persistent Data**: User progress saved between sessions
- **Reset Functionality**: Start over option in settings
- **Seamless Flow**: Smooth transition from onboarding to main app

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Complete Onboarding**: Follow the 3-step setup process
5. **Enjoy the Arena**: Battle with your personalized trading card!

## 🎮 Core Features

- **Arena Tab**: Battle cards with YOU vs NEMESIS comparison
- **Profile Tab**: Interactive to-dos, live timer, color-coded week
- **Mood Tracking**: 6 emotion selector with beautiful UI
- **Progress Tracking**: Real-time countdown and statistics
- **Achievement System**: Unlock rewards based on streak days

## 🛠️ Technical Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Avatar API**: DiceBear (with local fallback)
- **Storage**: Local Storage for user persistence

## 🔧 Avatar Generation

The app uses a dual-approach avatar system:

1. **DiceBear API**: Primary source for anime-style avatars
2. **Local Fallback**: SVG generation with colored initials if API fails
3. **Error Handling**: Automatic fallback ensures avatars always display
4. **Customization**: Users can generate new avatars or use fallback system

## 📱 User Experience

- **Smooth Onboarding**: Guided 3-step setup process
- **Persistent Progress**: Data saved between sessions
- **Responsive Design**: Works on mobile and desktop
- **Interactive Elements**: Hover effects, animations, and transitions
- **Fallback Systems**: App continues working even if external services fail

## 🎯 Development Status

✅ **Complete**: Onboarding flow, avatar generation, user persistence  
✅ **Complete**: Battle arena, profile system, mood tracking  
🔄 **In Progress**: Enhanced chat/forum system  
🔄 **Planned**: Social features, advanced analytics, power-ups