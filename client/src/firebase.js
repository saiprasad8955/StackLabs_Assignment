// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDbyc1MPrn0cxNQHHMIoTNeUh7LMPmuZlM",
    authDomain: "new-project-24158.firebaseapp.com",
    projectId: "new-project-24158",
    storageBucket: "new-project-24158.appspot.com",
    messagingSenderId: "125486533084",
    appId: "1:125486533084:web:cb61b608273dfaeacc6719",
    measurementId: "G-VX6FG4TECB"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { app, auth, signOut };
