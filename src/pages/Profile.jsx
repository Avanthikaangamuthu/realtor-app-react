import { getAuth, updateProfile } from 'firebase/auth';
import {doc, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {toast} from 'react-toastify';
import { useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import {FcHome} from 'react-icons/fc';


function Profile() {
  const auth = getAuth();
  const navigate = useNavigate()
  const [changeDetail, setchangeDetail] = useState();
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData;
  
  function onLogout(){
    auth.signOut()
    toast.success("Signed out Successfully");
    navigate("/")
  }

  function onChange(e) {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(){
    try{
      if(auth.currentUser.displayName!==name){
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name,
        })
      }
      toast.success("Profile Updated Successfully");
    }catch(error){
      toast.error("could not update the profile details")
    }
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input type='text' id='name' value={name} disabled={!changeDetail}  onChange={onChange} className={`w-full mb-6 px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-res-200"}`}/>
            
            <input type='email' id='email' value={email} disable className='w-full mb-6 px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 transition ease-in-out'/>

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center'>Do you want to Change your name?
                <span onClick={() => {
                  changeDetail && onSubmit()
                  setchangeDetail((prevState)=>!prevState)
                }} 
                className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer ml-1'>{changeDetail ? "Apply Change" : "Edit"}</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>Sign Out</p>
            </div>
          </form>
          <button type='submit' className='bg-blue-600 w-full text-whit uppercase px-7 py-3 rounded shadow-md hover:bg-blue-700 text-white text-sm font-medium transition ease-in-out duration-150 hover:shadow-lg cursor-pointer active:bg-blue-800'>
            <Link to='/create-listing' className='flex justify-center items-center'><FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>Sell or Rent Your Home</Link>
          </button>
        </div>
      </section>
    </>
  )
}

export default Profile