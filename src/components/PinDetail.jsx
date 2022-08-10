import {useState, useEffect} from 'react';
// import { pinDetailQuery, getSimilarPins } from "../utils/sanityDataFetch";
import { client, urlFor } from '../sanity/client';
import { useParams, Link } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiOutlineDelete } from "react-icons/ai";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";


import { useSelector, useDispatch } from 'react-redux';
import {  
    detail,
    comments,
    similar,
    pinLoadingStatus,
    commentStatus,
    getPinDetails,
    getPinsWithSimilarCategory,
    createNewComment,
}from "../reduxStore/dataSlices/pinDetailSlice"

const PinDetail = ({user}) => {

    const pinDetail = useSelector(detail)
    const similarPins = useSelector(similar)
    const pinComments = useSelector(comments)
    const pinLoading = useSelector(pinLoadingStatus)
    const commentLoading = useSelector(commentStatus)

    const { pinId } = useParams()
    // const [pinDetail, setPinDetail] = useState([])
    // const [similarPins, setSimilarPins] = useState([])
    const [ comment, setComment ] = useState("")
    const dispatch = useDispatch()


    useEffect(()=>{
        
        if(pinLoading === "idle" || pinId !==  pinDetail?._id){
            dispatch(getPinDetails(pinId))
        }

        if(pinLoading === "success"){
            dispatch(getPinsWithSimilarCategory({
                categoryTitle: pinDetail.category.categoryTitle,
                pinId
            }))
        }

    },[pinId, dispatch, pinDetail, pinLoading])

    const deleteComment = (key) =>{
        client
            .patch(pinId)
            .unset([`comments[_key=="${key}"]`])
            .commit()
            .then((data)=>{
                // fetchPinDetails()
                console.log("delete successful: ", data.comments)
            })
    }

    const addComment = ()=>{
        if(comment){
            dispatch(createNewComment({ comment, pinId, user }))
            setComment("")
        }
    }

    if(pinLoading === "pending") return <Spinner message="...Loading pin..."/>
    

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
                        {pinComments?.length !== 0
                            ? (
                                <div className='max-h-370 overflow-y-auto'>
                                    {pinComments?.map((comment)=>(
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

                                            {comment?.postedBy?._id === user?._id && (
                                                <div className="ml-auto p-3 rounded-full border hover:border hover:border-black cursor-pointer"
                                                    onClick={()=>deleteComment(comment?._key)}
                                                >
                                                    <AiOutlineDelete />
                                                </div>
                                            )}

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
                                {commentLoading ? "Adding Comment..." : " Done "}
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