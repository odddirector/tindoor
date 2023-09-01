import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getAuth } from "firebase/auth";
import keys from '../config/keys'
// import 'dotenv/config'

// const firebaseConfig = {
//   apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.PUBLIC_FIREBASE_APP_ID,
// }


// Create your own keys.js file with a keys object in it containing firebase keys 
// config/keys.js is excluded in .gitignore 
// (had problems with dotenv, didn't have time to resolve)
const firebaseConfig = {
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    projectId: keys.projectId,
    storageBucket: keys.storageBucket,
    messagingSenderId: keys.messagingSenderId,
    appId: keys.appId,
  }

const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage(app)
