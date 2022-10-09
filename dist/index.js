import { initializeApp } from 'firebase/app';
import { storage } from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyANeqdntumVrYAvF_R2Xu9JcqNEZJ050hA",
  authDomain: "three-js-8dcde.firebaseapp.com",
  projectId: "three-js-8dcde",
  storageBucket: "three-js-8dcde.appspot.com",
  messagingSenderId: "881561686603",
  appId: "1:881561686603:web:74259697900647726573ce",
  measurementId: "G-SCKV5VZ658"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);