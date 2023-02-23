// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrEahSpFGO-g_kNL_g9YIG2nsRtoouN-0",
  authDomain: "realtor-react-project-b23b7.firebaseapp.com",
  projectId: "realtor-react-project-b23b7",
  storageBucket: "realtor-react-project-b23b7.appspot.com",
  messagingSenderId: "124326518916",
  appId: "1:124326518916:web:bd052f14cbf371c41ce2d1"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()