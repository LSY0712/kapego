// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWph2DBXOIze-bMELe84w3vZwzJukGz7c",
  authDomain: "light-light-4d1f1.firebaseapp.com",
  projectId: "light-light-4d1f1",
  storageBucket: "light-light-4d1f1.firebasestorage.app",
  messagingSenderId: "676151221271",
  appId: "1:676151221271:web:a8b446dddde8197f519052"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 獲取 auth 實例
const auth = getAuth(app);

// Google 登入提供者
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };