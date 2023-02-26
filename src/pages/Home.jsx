import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { db } from '../firebase';
import {Link} from 'react-router-dom';
import ListingItem from '../components/ListingItem';

function Home() {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const[sellListings, setSellListings] = useState(null);
  
  useEffect(()=>{
    async function fetchListings(){
      try{
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("offer", "==", true), orderBy("timeStamp","desc"), limit(4));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setOfferListings(listings);
      } catch(error){
        console.log(error);
      }
    }
    fetchListings();
  },[])

  useEffect(()=>{
    async function fetchListings(){
      try{
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("type", "==", "rent"), orderBy("timeStamp", "desc"), limit(4));
        const querySnap = await getDocs(q);
        let listing = [];
        querySnap.forEach((doc)=>{
          return listing.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setRentListings(listing);
      } catch(error){
        console.log(error);
      }
    }
    fetchListings();
  },[])

  useEffect(()=>{
    async function fetchListings(){
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("type","==","sale"),orderBy("timeStamp","desc"),limit(4));
      const querySnap = await getDocs(q);
      let listing = [];
      querySnap.forEach((doc)=>{
        return listing.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setSellListings(listing);
    }
    fetchListings();
  },[])


  return (
    <div>
      <Slider/>
      <div className='max-w-6xl mx-auto pt-4 sapce-y-6'>{offerListings && offerListings.length>0 && (
        <div className='m-2 mb-6 '>
          <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent Offers</h2>
          <Link to='/offers'>
            <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration:150 ease-in-out'>Show more offers</p>
          </Link>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {offerListings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
            ))}
          </ul>
        </div>
      )}</div>

      <div className='max-w-6xl mx-auto pt-4 sapce-y-6'>{rentListings && rentListings.length>0 && (
        <div className='m-2 mb-6 '>
          <h2 className='px-3 text-2xl mt-6 font-semibold'>Places For Rent</h2>
          <Link to='/category/rent'>
            <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration:150 ease-in-out'>Show more places for rent</p>
          </Link>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {rentListings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
            ))}
          </ul>
        </div>
      )}
      ṅ</div>

      <div className='max-w-6xl mx-auto pt-4 sapce-y-6'>{sellListings && sellListings.length>0 && (
        <div className='m-2 mb-6 '>
          <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent Offers</h2>
          <Link to='/category/sale'>
            <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration:150 ease-in-out'>Show more places for sale</p>
          </Link>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {sellListings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
            ))}
          </ul>
        </div>
      )}</div>
    </div>
  )
}

export default Home