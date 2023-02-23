import React from 'react'
import { useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import {Link, useNavigate} from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {toast} from 'react-toastify'
import {getAuth} from 'firebase/auth'

function SignIn() {
  const navigate = useNavigate();

  const [showPassword, setshowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const {email, password} = formData;

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(e){
    e.preventDefault()
    try{
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if(userCredential.user){
          toast.success("Sign In Successfull");
          navigate("/");
        }
    }
    catch(error){
      toast.error("Invalid User Credentials");
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src='https://image.slidesharecdn.com/fundamentalsofelectriccircuits-170122184436/95/fundamentals-of-electric-circuits-1-638.jpg?cb=1485110912' alt='sign_in_image' className='w-full rounded-2xl'/>
        </div>
        <div  className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
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
              <p className='mb-6'>Don't have a account ? 
                <Link to='/sign-up' className='text-red-600 hover:text-red-700 ml-1'>Register</Link>
              </p>
              <p>
                <Link to='/forgot-password' className='text-blue-600 hover:text-blue-800'>Forgot Password</Link>
              </p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign In</button>
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

export default SignIn