import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

function Category(){
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetch, setLastFetch] = useState(null);
    const params = useParams();

    useEffect(()=>{
        async function fetchListings(){
            try{
                const listingRef = collection(db, "listings");
                const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timeStamp", "desc"), limit(8));
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length-1];
                setLastFetch(lastVisible)
                let listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                });
                setListings(listings);
                setLoading(false);
                console.log(listings);
            }
            catch(error){
                toast.error("Could not fetch listings");
            }
        }
        fetchListings();
    },[params.categoryName])

    async function onFetchMoreListing(){
        try{
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timeStamp", "desc"), startAfter(lastFetch), limit(4));
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length-1];
            setLastFetch(lastVisible)
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            });
            setListings((prevState)=>[
                ...prevState,...listings
            ]);
            setLoading(false);
            console.log(listings);
        }
        catch(error){
            toast.error("Could not fetch listings");
        }
    }
    
    return <div className="max-w-6xl mx-auto px-3">
            <h1 className="text-3xl text-center mt-6 font-bold">{params.categoryName === "rent" ? "Places for Rent" :"Places for Sale"}</h1>
            {loading ? (
            <Spinner/> ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                           {listings.map((listing)=>(
                            <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                           ))}
                        </ul>
                    </main>
                    {lastFetch && (
                        <div className="flex justify-center items-center">
                            <button onClick={onFetchMoreListing}className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out">Load More</button>
                        </div>
                    )

                    }
                </>
            ) : (
                <p>There are no current {params.categoryName === "rent" ? "places for rent" : "places for sale"}</p>
            )
            }
        </div>
    
}

export default Category