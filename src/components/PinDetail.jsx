import {useState, useEffect} from 'react';
import { pinDetailQuery, getSimilarPins } from "../utils/sanityDataFetch";
import { client, urlFor } from '../sanity/client';
import { useParams, Link } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const PinDetail = ({user}) => {

    const { pinId } = useParams()
    const [pinDetail, setPinDetail] = useState([])
    const [similarPins, setSimilarPins] = useState([])
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
            {pinDetail && (
                // xl => @media (max-width: 1279px)
                <div className="flex flex-col xl:flex-row bg-white" style={{maxWidth:'1500px', borderRadius:'32px'}}>
                    <div className="flex justify-center items-center md:items-start" >
                        <img 
                            className="rounded-t-3xl rounded-b-3xl"
                            src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
                            alt="user-post"
                        />
                    </div>
                    <div className='w-full p-5 flex-1 xl:min-w-620' >

                        <div className="flex items-center gap-2" >
                            <a
                                href={`${pinDetail?.image?.asset?.url}?dl=`}
                                download
                                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                            >
                                <MdDownloadForOffline />
                            </a>
                            {pinDetail.destination && (
                                <a
                                    href={pinDetail.destination}
                                    target="_blank"
                                    rel = "noreferrer"
                                    className='bg-secondaryColor p-2 rounded-full opacity-50 hover:opacity-100'
                                >
                                    {pinDetail?.destination}
                                </a>
                            )}
                        </div>

                        <div>
                            <h1 className="text-4xl break-words mt-3">
                                {pinDetail?.title}
                            </h1>
                            <p className="mt-3">
                                {pinDetail?.about}
                            </p>
                        </div>
                        
                        <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                            <img src={pinDetail?.postedBy?.userImgUrl} alt="user-profile" className='w-10 h-10 rounded-full border border-black' referrerPolicy="no-referrer"/>
                            <p className="font-bold">{pinDetail?.postedBy?.userName}</p>
                        </Link>
                        
                        <h2 className='mt-5 text-2xl'>Comments</h2>
                        {pinDetail?.comments
                            ? (
                                <div className='max-h-370 overflow-y-auto'>
                                    {pinDetail?.comments?.map((comment)=>(
                                        <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={comment?._key}>

                                            <img 
                                                src={comment.postedBy?.userImgUrl}
                                                className='w-10 h-10 rounded-full border border-black' 
                                                referrerPolicy="no-referrer"
                                                alt="user profile"
                                            />

                                            <div className='flex flex-col'>
                                                <p className="font-bold">{comment?.postedBy?.userName}</p>
                                                <p>{comment.comment}</p>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )
                            :<div>The image has no comments</div>
                        }

                        <div className="flex flex-wrap mt-6 gap-3">
                            <Link to={`/user-profile/${user?._id}`}>
                                <img src ={user?.userImgUrl} 
                                    alt="user-profile" 
                                    className='w-10 h-10 rounded-full border border-black' 
                                    referrerPolicy="no-referrer"
                                />
                            </Link>
                            <input 
                                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                                type="text"
                                placeholder='Comment muhimu mtu yangu'
                                value={comment}
                                onChange = {(e)=>setComment(e.target.value)}
                            />
                            <button
                                type="button"
                                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                                onClick = {addComment}
                            >
                                {addingNewComment ? "Adding Comment..." : " Done "}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {similarPins?.length > 0 && (
                <h2 className="mt-8 mb-4 text-center font-bold text-2xl">
                    More like this
                </h2>
            )}
            {similarPins?.length !== 0 && <MasonryLayout pins={similarPins} />}
        </>
    )
}

export default PinDetail