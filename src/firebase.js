import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsRC0q6mFVuTRmdOXSVbo5K5MqKnEoJpo",
  authDomain: "federated-predictive-21cef.firebaseapp.com",
  projectId: "federated-predictive-21cef",
  storageBucket: "federated-predictive-21cef.firebasestorage.app",
  messagingSenderId: "361205824007",
  appId: "1:361205824007:web:89320683746c1c4ef7c8a2",
  measurementId: "G-NY186FSKZ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
