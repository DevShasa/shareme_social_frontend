import React, { useEffect, useState } from 'react'
import { NavLink, Link } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import  { IoIosArrowForward } from "react-icons/io"
import logo from "../assets/logo.png"
import { fetchCategories } from "../utils/sanityDataFetch";
import { client } from "../sanity/client";

const isActiveStyle = "flex items-center px-5 gap-5  font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";
const isNotActiveStyle = "flex items-center px-5 gap-5  text-gray-500 hover:text-black   transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ closeToggle, user }) => {

    const [ categories, setCategories ] = useState([])

    useEffect(()=>{
        const query = fetchCategories();
        client.fetch(query).then((data)=>console.log("CATEGORIES",data))
    },[])

    const handleCloseSidebar = ()=>{
        // Check if closetoggle was passed by the parent(desktop div does not pass closeToggle)
        if(closeToggle){
            closeToggle(false)
        }
    }

    return (
        <>
            <div className="flex flex-col justify-between bg-white h-full min-w-210 overflow-y-scroll ficha-scrollbar" >
                <div className="flex flex-col">
                    {/* first child in flex-col container */}
                    <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                        onClick={handleCloseSidebar}
                    >
                        <img src={logo} alt="logo" className="w-full"/>    
                    </Link>

                    {/* second child in flex col container */}
                    <div className="flex flex-col gap-5">
                        <NavLink to="/" className={({isActive})=>(isActive ? isActiveStyle : isNotActiveStyle)}
                            onClick={handleCloseSidebar}
                        >   
                            <RiHome2Fill /> Home
                        </NavLink>

                        <h3 className="mt-2 px-5 text-base 2xl:text-lg">Discover Categories</h3>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar