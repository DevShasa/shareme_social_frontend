import React, { useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { client, urlFor } from "../sanity/client"


function Pin({pin}) {

    const navigate = useNavigate()
    const [postHover, setPostHover] = useState(false)


    // Get client details, clear if there is nothing
    let user = localStorage.getItem("subjectId")
    if(!user){ 
        localStorage.clear(); 
    }else{
        user = JSON.parse(localStorage.getItem("subjectId"))
    }


    function hasUserSavedMe(){
        let savedOrNot = []
        savedOrNot = pin?.save?.filter((item)=>(
            item?.postedBy._id === user
        ))

        // if(Array.isArray(savedOrNot)){
            return savedOrNot?.length > 0 ? true : false
        // }else{
        //     return false
        // }
    }

    function savePin(id){

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

                        <div>
                            <a href={`${pin?.image?.asset?.url}?dl=`}
                                download
                                onClick={(e)=>{e.stopPropagation()}}
                                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div>

                        {hasUserSavedMe() 
                            ? (<button 
                                type="button" 
                                disabled
                                className="cursor-not-allowed bg-blue-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-lg outline-none hover:shadow-md"
                                >
                                    Pin Saved
                                </button>
                                )
                            : (
                                <button
                                    onClick={(e)=>{ 
                                        e.stopPropagation()
                                        savePin(pin?._id)
                                    }}
                                    type="button"
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-lg hover:shadow-md outline-none"
                                >
                                    Save Post
                                </button>
                            )
                    }

                    </div>
                )}
            </div>
        </div>
    )
}

export default Pin