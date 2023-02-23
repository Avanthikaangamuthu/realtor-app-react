import {useState} from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router';

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth(); 
  const [loading, setLoading] = useState(false);

  const  [formData, setFormdata] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {}
  })
  const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountPrice, latitude, longitude, images} = formData;

  function onChange(e) {
    let boolean = null;
    if(e.target.value === "true"){
      boolean = true
    }
    if(e.target.value === "false"){
      boolean = false
    }
    //files
    if(e.target.files){
      setFormdata((prevState)=>({
        ...prevState,
        images: e.target.files
      }));
    }
    //text/boolean/number
    if(!e.target.files){
      setFormdata((prevState)=>({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    if(+discountPrice >= +regularPrice){
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if(images.length>6){
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }

    let geolocation = {}
    geolocation.lat = latitude;
    geolocation.lng = longitude;

    async function storeImage(image){
      return new Promise((resolve, reject)=>{
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on("state_changed", 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          }, 
          (error) => {
            reject(error)
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
          });
          }
        );
      })
    }

    const imgUrls = await Promise.all(
      [...images]
      .map((image)=>storeImage(image))
    ).catch((error)=>{
      setLoading(false);
      toast.error('There is a problem in uploading the image');
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timeStamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    !formDataCopy.offer && delete formDataCopy.discountPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if(loading){
    return <Spinner/>
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold'>Sell  / Rent</p>
            <div className='flex'>
                <button type='button' id='type' value="sale" onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${type==='rent' ? "bg-white text-black" : "bg-slate-600 text-white"}`}>Sell</button>

                <button type='button' id='type' value="rent" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${type==='sale' ? "bg-white text-black" : "bg-slate-600 text-white"}`}>Rent</button>
            </div>
            <p className='text-lg mt-6 font-semibold'>Name</p>
            <input type="text" id="name" value={name} onChange={onChange} placeholder="Name" maxLength='32' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out shadow-md focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>

            <div className='flex space-x-6 mb-6'>
              <div>
                <p className='text-lg font-semibold'>Bedchamber</p>
                <input type='number' id='bedrooms' value={bedrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-ini-out focus:bg-white focus:border-slate-600 shadow-md text-center'/>
              </div>
              <div>
                <p className='text-lg font-semibold'>Lavatory</p>
                <input type='number' id='bathrooms' value={bathrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-ini-out focus:bg-white focus:border-slate-600 shadow-md text-center'/>
              </div>
            </div>

            <p className='text-lg mt-6 font-semibold'>Parking</p>
            <div className='flex'>
                <button type='button' id='parking' value={true} onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id='parking' value={false} onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>No</button>
            </div>

            <p className='text-lg mt-6 font-semibold'>Furnished</p>
            <div className='flex'>
                <button type='button' id='furnished' value={true} onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id='furnished' value={false} onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>No</button>
            </div>

            <p className='text-lg mt-6 font-semibold'>Address</p>
            <textarea type="text" id="address" value={address} onChange={onChange} placeholder="Address" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out shadow-md focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>
            
            <div className='flex space-x-6 justify-start mb-6'>
              <div>
                <p className='text-lg font-semibold'>Latitude</p>
                <input type='number' id='latitude' value={latitude} onChange={onChange} required min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
              </div>
              <div>
                <p className='text-lg font-semibold'>Longitude</p>
                <input type='number' id='longitude' value={longitude} onChange={onChange} min="-180" max="180" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
              </div>
            </div>

            <p className='text-lg font-semibold'>Description</p>
            <textarea type="text" id="description" value={description} onChange={onChange} placeholder="Description" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out shadow-md focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'/>

            <p className='text-lg font-semibold'>Offer</p>
            <div className='flex mb-6'>
                <button type='button' id='offer' value={true} onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>Yes</button>

                <button type='button' id='offer' value={false} onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition ease-in-out duration-150 w-full ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>No</button>
            </div>

            <div className='flex items-center mb-6'>
              <div>
                <p className='text-lg font-semibold'>Regular Price</p>
                <div  className='flex w-full justify-center items-center space-x-6'>
                  <input type='number' id='regularPrice' value={regularPrice} onChange={onChange} min='50' max='400000000' required className='w-full px-4 text-xl text-gray-700 bg-white shadow-md border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                  {type==='rent' && (
                  <div>
                    <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
            
            {offer && (
            <div className='flex items-center mb-6'>
              <div>
                <p className='text-lg font-semibold'>Discounted Price</p>
                <div  className='flex w-full justify-center items-center space-x-6'>
                  <input type='number' id='discountPrice' value={discountPrice} onChange={onChange} min='20' max='400000000' required={offer} className='w-full px-4 text-xl text-gray-700 bg-white shadow-md border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'/>
                  {type==='rent' && (
                  <div>
                    <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
            )}

            <div className='mb-6'>
              <p className='text-lg font-semibold'>Images</p>
              <p className='text-gray-600'>The first image will be cover (max=6)</p>
              <input type='file' id='image' onChange={onChange} accept=".jpg,.png,.jpeg" multiple required className='w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out rounded shadow-md focus:bg-white focus:border-slate-600'/>
            </div>

            <button type='submit' className='mb-6 w-full bg-blue-600 text-white px-7 py-3 font-medium text-sm uppercase rounded shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-800 active:shadow-lg transition ease-in-out duration-150'>Create Listing</button>
        </form>
    </main>
  )
}
