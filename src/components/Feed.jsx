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
            const query = getFeed(categoryId);
            client.fetch(query).then((data)=>{
                setPins(data)
                setLoading(false)
            })
        }
    },[categoryId])

    if(loading){
        return (
            <Spinner  message={`Adding new ideas to your feed`} />
        );
    }

    return (
        <div>
            {pins &&(
                <MasonryLayout pins={pins}/>
            )}
        </div>
    )
}

export default Feed