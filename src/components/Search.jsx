// Once the user has typed something in the Navbar Component
// They are redirected to this page which fetches and displays
// the search results 
import React, { useState, useEffect } from 'react';
import { client } from "../sanity/client";
import { getFeed, getSearchQuery } from "../utils/sanityDataFetch";
import Spinner from "./Spinner";
import MasonryLayout from './MasonryLayout';

const Search = ({searchTerm}) => {
    const [ pins, setPins ] = useState();
    const [ loading, setLoading ] = useState(false);
    
    useEffect(()=>{
        if(searchTerm !== ""){
            // note, this request is sent for every keystroke in the searchbar
            setLoading(true)
            const query = getSearchQuery(searchTerm.toLowerCase())
            client.fetch(query).then((data)=>{
                setPins(data);
                setLoading(false)
            })
        }
    },[searchTerm])

    return (
        <div>
            {loading && <Spinner message="searching pins" />}
            {pins?.length !== 0 && <MasonryLayout pins={pins}/>}
            {pins?.length === 0 && searchTerm !== '' && !loading && (
                <div className="mt-10 text-center text-xl">
                    No Pins Found
                </div>
            )}
        </div>
    )
}

export default Search