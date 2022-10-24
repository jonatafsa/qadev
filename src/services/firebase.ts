// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5ZMP6NIjVv5Ygx66YUaKi8OCcTLDbI28",
  authDomain: "game-perguntas-e-respostas.firebaseapp.com",
  projectId: "game-perguntas-e-respostas",
  storageBucket: "game-perguntas-e-respostas.appspot.com",
  messagingSenderId: "6707330959",
  appId: "1:6707330959:web:dd7904cd3ad519c4c4d5fa",
  measurementId: "G-546MB3W648",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
