import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { client } from "../sanity/client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner"
import { getFeed, getSearchQuery } from "../utils/sanityDataFetch";

const Feed = () => {

    const [ pins, setPins ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const { categoryId } = useParams()


    useEffect(()=>{
        if(categoryId){
            setLoading(true)
            const query = getSearchQuery(categoryId);
            client.fetch(query).then((data)=>{
                setPins(data)
                setLoading(false)
            })
        }else{
            const query = getFeed();
            setLoading(true)
            client.fetch(query).then((data)=>{
                setPins(data)
                setLoading(false)
            })
        }
    },[categoryId])

    if(loading){
        return (
            <Spinner  message={`Loading feed`} />
        );
    }

    return (
        <div>
            {pins &&(
                // setloading is passed to masonry and then to pin for use in delete function
                <MasonryLayout pins={pins} setLoading={setLoading}/>
            )}
        </div>
    )
}

export default Feed