/* Firebase initialization for QuitCard Arena */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAdJ3lRxhgZWhnqH8SNQsT1bTFB8E0-cDg",
  authDomain: "quitarena-a97de.firebaseapp.com",
  databaseURL: "https://quitarena-a97de-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quitarena-a97de",
  storageBucket: "quitarena-a97de.firebasestorage.app",
  messagingSenderId: "693525963288",
  appId: "1:693525963288:web:a175e9a8bd56fffb35596d",
  measurementId: "G-H2CCRXYY74"
};

// Initialize app once (avoid duplicate apps during HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Core services
const db = getDatabase(app, firebaseConfig.databaseURL);
const auth = getAuth(app);

// Configure persistent authentication (30 days)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence configured for 30 days');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

let analytics = null;
(async () => {
  try {
    if (await analyticsSupported()) {
      analytics = getAnalytics(app);
    }
  } catch (err) {
    // Ignore analytics failures in dev
    console.debug('Analytics not initialized:', err?.message);
  }
})();

export { app, auth, db, analytics };
