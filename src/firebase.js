 import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, getRedirectResult, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoaOu0ISJ4ruxvjB7hLa1XEJZw2aeN5lI",
  authDomain: "qbit-01.firebaseapp.com",
  projectId: "qbit-01",
  storageBucket: "qbit-01.firebasestorage.app",
  messagingSenderId: "620836534514",
  appId: "1:620836534514:web:8b50c1c88e8eb4e4c3b86b",
  measurementId: "G-K4N2VV2JE7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

const loginWithGoogle = () => signInWithPopup(auth, provider);
const loginWithGoogleRedirect = () => signInWithRedirect(auth, provider);

// Handler for redirect result
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    throw error;
  }
};


// Email/password sign in
const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Email/password sign up
const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

const logout = () => signOut(auth);

export { auth, loginWithGoogle, loginWithGoogleRedirect, handleRedirectResult, logout, signInWithEmail, signUpWithEmail };
