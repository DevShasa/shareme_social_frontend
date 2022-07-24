import React, { useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { client, urlFor } from "../sanity/client"


function Pin({pin, setLoading}) {

    const navigate = useNavigate()
    const [postHover, setPostHover] = useState(false)
    const [savingPost, setSavingPost] = useState(false)

    // Get client details, clear if there is nothing
    let user = localStorage.getItem("subjectId")
    if(!user){ 
        localStorage.clear(); 
    }else{
        user = JSON.parse(localStorage.getItem("subjectId"))
    }

    function savedPinArray(){
        // return true for the whole array if one item meets condition
        return pin?.save?.some((item) =>( item?.postedBy._id === user))
    }

    function savePin(id){
        if(!savedPinArray() ){
            // pin's saved array does not have user id ..
            // thus user has not saved pin
            setSavingPost(true)

            client
                .patch(id)
                .setIfMissing({save:[]})
                .insert("after", "save[-1]",[
                    {
                        _key:uuidv4(),
                        userId: user,
                        postedBy:{ _type:"postedBy", _ref:user},
                    },
                ])
                .commit()
                .then(()=>{
                    //future use redux and dispatch the new pin to the store
                    window.location.reload();
                    setSavingPost(false)
                });
        }
    }

    function deletePin(id){
        //TODO move array of pins to redux store
        // Make delete request in thunk then request new array and update store
        // To prevent stale data persisting in app
        setLoading(true)
        client.delete(id).then(()=>{
            window.location.reload()
            setLoading(false)
        })
    }

    return (
        <div className="m-2">

            <div
                onMouseEnter={()=> setPostHover(true)}
                onMouseLeave={()=> setPostHover(false)}
                onClick={()=>navigate(`/pin-detail/${pin._id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out" 
            >
                {pin.image && <img src={urlFor(pin.image).width(250).url()} alt="user pin" className="rounded-lg w-full"/>}

                {postHover && (
                    <div className="absolute inset-0 flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" >
                        <div className="flex items-center justify-between">
                            <div>
                                <a href={`${pin?.image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e)=>{e.stopPropagation()}}
                                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>

                            {savedPinArray()
                                ? (<button 
                                    type="button" 
                                    disabled
                                    className="cursor-not-allowed bg-blue-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-full outline-none hover:shadow-md h-fit"
                                    >
                                        {pin?.save?.length} Saved 
                                    </button>
                                    )
                                : (
                                    <button
                                        onClick={(e)=>{ 
                                            e.stopPropagation()
                                            savePin(pin?._id)
                                        }}
                                        type="button"
                                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-full hover:shadow-md outline-none h-fit"
                                    >
                                        {savingPost ? "Saving post" : "Save Post"}
                                    </button>
                                )
                            }
                        </div>
                        <div className="flex justify-between items-center w-full gap-2">
                            {pin?.destination != null && (
                                <a
                                    href={pin?.destination}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md text-xs"
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {pin?.destination?.slice(8,17)}...
                                </a>
                            )}

                            {pin?.postedBy?._id === user &&(
                                <button
                                    type="button"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        deletePin(pin?._id);
                                    }}
                                    className="outline-none p-2 bg-white rounded-full text-xs opacity-75 hover:opacity-100 w-8 h-8 flex items-center justify-center ml-auto"
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Link
                to={`/user-profile/${pin?.postedBy?._id}`}
                className="flex mt-2 gap-2 items-center"
            >
                <img className="w-8 h-8 rounded-full object-cover" src={pin?.postedBy?.userImgUrl} alt={pin?.postedBy?.userName}/>
                <p className="capitalize">{pin?.postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin