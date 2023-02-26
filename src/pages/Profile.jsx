import { getAuth, updateProfile } from 'firebase/auth';
import {collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where} from 'firebase/firestore';
import {db} from '../firebase';
import {toast} from 'react-toastify';
import { useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {FcHome} from 'react-icons/fc';
import ListingItem from '../components/ListingItem';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate()
  const [changeDetail, setchangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

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
    }));
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
        });
      }
      toast.success("Profile Updated Successfully");
    }catch(error){
      toast.error("could not update the profile details")
    }
  }

 
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

    async function onDelete(listingID){
      if(window.confirm("Are you sure you want to delete this listing")){
        await deleteDoc(doc(db, "listings", listingID));
        const updatedListing = listings.filter(
          (listing) => listing.id !== listingID
        );
        setListings(updatedListing);
        toast.success("Listing has been deleted successfully");
      }
    }

    function onEdit(listingID){
      navigate(`/edit-listing/${listingID}`);
    }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input type='text' id='name' value={name} disabled={!changeDetail}  onChange={onChange} className={`w-full mb-6 px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-res-200"}`}/>
            
            <input type='email' id='email' value={email} disabled className='w-full mb-6 px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 transition ease-in-out'/>

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
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length>0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6 '>{
              listings.map((listing)=>(
                <ListingItem 
                  key={listing.id} 
                  id={listing.id} 
                  listing={listing.data}
                  onDelete = {()=>onDelete(listing.id)}
                  onEdit = {()=>onEdit(listing.id)}
                />
              ))
            }</ul>
          </>
        )}
      </div>
    </>
  )
}

export default Profile