// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortex-ai-d47ce.firebaseapp.com",
  projectId: "cortex-ai-d47ce",
  storageBucket: "cortex-ai-d47ce.firebasestorage.app",
  messagingSenderId: "568692382756",
  appId: "1:568692382756:web:824b38349520120d88ccb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()