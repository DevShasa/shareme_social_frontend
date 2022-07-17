import React, {useState, useEffect, useRef} from 'react';
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, UserProfile } from "../components/index";
import { client } from "../sanity/client";
import logo from "../assets/logo.png";
import Pins from "./Pins";
import { userQuery } from "../utils/sanityDataFetch";

const Home = () => {

    const navigate = useNavigate();
    const [ toggleSidebar, setToggleSidebar ] = useState(false)
    const [ user, setUser ] = useState(null)
    const scrollRef = useRef(null)

    // load id from localstorage, if nothing is in there it will return null 
    const userInfo = localStorage.getItem("subjectId")

    useEffect(()=>{
        if( userInfo ){
            // only fetch data from sanity if userinfo is present
            const query = userQuery(userInfo);
            client.fetch(query).then((data)=>{
                setUser(data[0])
            })
        }else{
            navigate("/login")
        }

    },[userInfo, navigate ])

    useEffect(()=>{
        // move scroll to the top of the page
        scrollRef.current.scrollTo(0,0)
    },[])

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 h-screen transition-height duration-75 ease-out">
            {/* Two sidebars one for mobile device one for large screens */}
            <div className="hidden md:flex h-screen flex-initial">
                {/* md = @media (min-width: 768px) */}
                <Sidebar user={user && user}/> 
            </div>
            <div className="flex flex-row md:hidden">
                {/* md = @media (min-width: 768px) */}
                <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className="cursor-pointer" onClick={()=>setToggleSidebar(true)}/>
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-28"/>
                    </Link>
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.userImgUrl} alt={user?.userName} className="w-9 h-9 rounded-full border-solid border-2 border-black"/>
                    </Link>
                </div>
                { toggleSidebar && (
                <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-mg z-10 animate-slide-in">
                    <div className="absolute w-full flex justify-end items-center p-2">
                        <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={()=>setToggleSidebar(false)}/>
                    </div>
                    <Sidebar closeToggle={setToggleSidebar} user={user && user}/>
                </div>)}


            </div>
            <div className="pb-1 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/*" element={<Pins user={user & user}/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Home