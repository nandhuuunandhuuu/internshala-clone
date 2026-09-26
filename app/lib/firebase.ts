import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGxPf4SBWVXTuf8Wwday6qTQWXM7rtZXE",
  authDomain: "careerlaunch-8bd72.firebaseapp.com",
  projectId: "careerlaunch-8bd72",
  storageBucket: "careerlaunch-8bd72.firebasestorage.app",
  messagingSenderId: "206594216806",
  appId: "1:206594216806:web:770bf3686479756b456ea7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);