import React from 'react';
import { useState } from 'react';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai";
import {Link, useNavigate} from 'react-router-dom';
import AuthButton from '../components/AuthButton';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from '../firebase';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import {toast} from 'react-toastify';

function SignUp() {
  const [showPassword, setshowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const {name, email, password} = formData;
  const navigate = useNavigate();

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName : name
      })
      const user = userCredential.user;
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid),formDataCopy);
      toast.success("Sign Up was Successfull");
      navigate('/');
    } 
    catch (error) {
      toast.error("Something went wrong with the registration");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src='https://image.slidesharecdn.com/fundamentalsofelectriccircuits-170122184436/95/fundamentals-of-electric-circuits-1-638.jpg?cb=1485110912' alt='sign_up_image' className='w-full rounded-2xl'/>
        </div>
        <div  className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
          <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="text" id='name' value={name} onChange={onChange} placeholder='Full Name'
            />
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="email" id='email' value={email} onChange={onChange} placeholder='Email Address'
            />
            <div className='relative mb-6'>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} id='password' value={password} onChange={onChange} placeholder='Password'
            />
            {showPassword ? (
              <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setshowPass((prevState)=>!prevState)}/>
            ) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setshowPass((prevState)=>!prevState)}/>)}
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Have a account ? 
                <Link to='/sign-in' className='text-red-600 hover:text-red-700 ml-1'>Sign In</Link>
              </p>
              <p>
                <Link to='/forgot-password' className='text-blue-600 hover:text-blue-800'>Forgot Password</Link>
              </p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign Up</button>
          <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t after:border-gray-300 after:flex-1'>
            <p className='text-center font-semibold mx-4'>OR</p>
          </div>
          <AuthButton/>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUp