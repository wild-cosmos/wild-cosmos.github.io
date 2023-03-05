import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAorv0lOwCM0sq-7KomOWUr8qLgBWpYp7I',
  authDomain: 'wild-cosmos.firebaseapp.com',
  projectId: 'wild-cosmos',
  storageBucket: 'wild-cosmos.appspot.com',
  messagingSenderId: '287444095460',
  appId: '1:287444095460:web:8491cd3768cb81049537f1',
  measurementId: 'G-S5651YVBHE',
};

export const firebaseApp = initializeApp(firebaseConfig);

export const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider('6LfnNlEkAAAAAOpg3mN0fqXnJyIWWavvbeO4c7e1'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

export const analytics = getAnalytics(firebaseApp);

export const auth = getAuth(firebaseApp);

// const db = getFirestore(firebaseApp);

// export const warbandRef = collection(db, 'warbands');
