import { getAuth, onAuthStateChanged } from 'firebase/auth';
import  { useEffect, useState } from 'react';

export function useAuthStatus(){
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setloading] = useState(true);

    useEffect(()=>{
        const auth = getAuth()
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setLoggedIn(true);
            }
            setloading(false);
        })
    },[])
    return{loggedIn, loading};
}