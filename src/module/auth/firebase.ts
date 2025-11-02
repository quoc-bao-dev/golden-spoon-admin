"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAq8ZqnCzBvn5MfD9SE7cvl10nVDEoBWss",
    authDomain: "vouchee-v1.firebaseapp.com",
    projectId: "vouchee-v1",
    storageBucket: "vouchee-v1.firebasestorage.app",
    messagingSenderId: "605728725079",
    appId: "1:605728725079:web:d40b31ddea6caa3ea8eb12",
};

let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0]!;
}

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
