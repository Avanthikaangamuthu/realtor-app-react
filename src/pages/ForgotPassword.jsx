import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import {toast} from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e){
    setEmail(e.target.value);
  }

  async function onSubmit(e){
    e.preventDefault();
    try{
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset Link was sent succcessfully");
    }
    catch(error){
      toast.error("Invalid Email-ID");
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src='https://image.slidesharecdn.com/fundamentalsofelectriccircuits-170122184436/95/fundamentals-of-electric-circuits-1-638.jpg?cb=1485110912' alt='sign_in_image' className='w-full rounded-2xl'/>
        </div>
        <div  className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="email" id='email' value={email} onChange={onChange} placeholder='Email Address'
            />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Don't have a account ? 
                <Link to='/sign-up' className='text-red-600 hover:text-red-700 ml-1'>Register</Link>
              </p>
              <p>
                <Link to='/sign-in' className='text-blue-600 hover:text-blue-800'>Sign in instead</Link>
              </p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Send reset password</button>
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

export default ForgotPassword