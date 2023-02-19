import React from 'react'
import { useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"

function SignIn() {
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
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src='https://image.slidesharecdn.com/fundamentalsofelectriccircuits-170122184436/95/fundamentals-of-electric-circuits-1-638.jpg?cb=1485110912' alt='sign_in_image' className='w-full rounded-2xl'/>
        </div>
        <div  className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="email" id='email' value={email} onChange={onChange} placeholder='Email Address'
            />
            <div className='relative mb-6'>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} id='password' value={password} onChange={onChange} placeholder='Password'
            />
            {showPassword ? (
              <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setshowPass((prevState)=>!prevState)}/>
            ) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setshowPass((prevState)=>!prevState)}/>)}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignIn