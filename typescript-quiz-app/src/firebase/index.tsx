import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  persistentLocalCache,
  PersistentLocalCache,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDd19QER41mmU6QZQ3k9HHplg36p3U41pw",
  authDomain: "typescript-quiz-38cc3.firebaseapp.com",
  projectId: "typescript-quiz-38cc3",
  storageBucket: "typescript-quiz-38cc3.appspot.com",
  messagingSenderId: "154722359786",
  appId: "1:154722359786:web:aca56ccfc02d35a782fa93",
};
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);
// const db = getFirestore(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache(/*settings*/ {}),
});

export { db, auth };
