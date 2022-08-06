import {useState, useEffect} from 'react';
import { pinDetailQuery, getSimilarPins } from "../utils/sanityDataFetch";
import { client, urlFor } from '../sanity/client';
import { useParams, Link } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const PinDetail = () => {

    const { pinId } = useParams()
    const [pinDetail, setPinDetail] = useState([])
    const [similarPins, setSimilarPins] = useState()
    const [ comment, setComment ] = useState("")
    const [addingNewComment, setAddingNeComment] = useState(false)

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

    const addComment = ()=>{

    }

    if(!pinDetail) return <Spinner message="...Loading pin..."/>
    

    return (
        <>
            {pinDetail.length !== 0 && (
                // xl => @media (max-width: 1279px)
                <div className="flex flex-col xl:flex-row bg-white" style={{maxWidth:'1500px', borderRadius:'32px'}}>
                    <div className="flex justify-center items-center md:items-start" id="nicheki">
                        <img 
                            className="rounded-t-3xl rounded-b-lg"
                            src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
                            alt="user-post"
                        />
                    </div>
                    <div className='w-full p-5 flex-1 xl:min-w-620' id="nicheki">

                    </div>
                </div>
            )}
        </>
    )
}

export default PinDetail