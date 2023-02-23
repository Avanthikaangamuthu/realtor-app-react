import React from "react";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {toast} from 'react-toastify';
import {FcGoogle} from "react-icons/fc";
import { useNavigate } from "react-router";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function AuthButton(){
    const navigate = useNavigate();

    async function onGoogleClick(){
        try{
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists()){
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }
            toast.success("Sign Up was Successfull");
            navigate("/");
        }
        catch(error){
            toast.error("Could not authorize with Google");
        }
    }
    return(
        <button type='button' className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg active:shadow:lg tansition duration-150 ease-in-out rounded" onClick={onGoogleClick}><FcGoogle className="text-2xl bg-white rounded-full mr-2"/>Continue with Google</button>
    )
}

export default AuthButton