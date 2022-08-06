import {useState, useEffect} from 'react';
import { pinDetailQuery, getSimilarPins } from "../utils/sanityDataFetch";
import { client, urlFor } from '../sanity/client';
import { useParams } from 'react-router-dom';

const PinDetail = () => {

    const { pinId } = useParams()
    const [pinDetail, setPinDetail] = useState()
    const [similarPins, setSimilarPins] = useState()

    const fetchPinDetails = ()=>{
        const query = pinDetailQuery(pinId)
        if(query){
            // get the pin using pin id
            client.fetch(query).then((data)=>{
                console.log('PIN DATA FETCHED----->', data)
                setPinDetail(data[0])

                // if pin has been sucessfuly fetched get pins with similar categories
                if(data[0]){
                    const query2 = getSimilarPins(data[0].category.categoryTitle, pinId)
                    client.fetch(query2).then((response)=>{
                        console.log("these are the similar pins", response)
                        setSimilarPins(response)
                    })
                }
            })
        }
    }

    useEffect(()=>{
        fetchPinDetails()
    },[pinId])

    return (
        <div>PinDetail</div>
    )
}

export default PinDetail