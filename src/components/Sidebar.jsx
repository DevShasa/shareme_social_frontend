import React, { useEffect, useState } from 'react'
import { NavLink, Link } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import  { IoIosArrowForward } from "react-icons/io"
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import {  
    getAllCategories,
    categoriesFromStore,
    categoryFetchStatus,
    // categoryFetchError
} from "../reduxStore/dataSlices/categorySlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const isActiveStyle = "flex items-center px-5 gap-5  font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";
const isNotActiveStyle = "flex items-center px-5 gap-5  text-gray-500 hover:text-black   transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ closeToggle, user }) => {

    const categoryList = useSelector(categoriesFromStore);
    const status = useSelector(categoryFetchStatus);
    const dispatch = useDispatch()
    const [ categories, setCategories ] = useState([])

    useEffect(()=>{
        if(status === "idle"){
            dispatch(getAllCategories())
        }if(status ==="success"){
            setCategories(categoryList?.filter(item => item.categoryTitle !== "others"))
        }
    },[status,categoryList, dispatch ])

    const handleCloseSidebar = ()=>{
        // Check if closetoggle was passed by the parent(desktop div does not pass closeToggle)
        if(closeToggle){
            closeToggle(false)
        }
    }

    return (
        <>
            <div className="flex flex-col justify-between bg-white h-full min-w-210 overflow-y-scroll ficha-scrollbar">
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


                        {categories?.length !== 0 
                            ? (
                                categories?.map((category)=>(
                                    <NavLink key={category._id} className={({isActive})=>(isActive ? isActiveStyle : isNotActiveStyle)}
                                        to={`/category/${category.categoryTitle}`}
                                        onClick={handleCloseSidebar}
                                    >
                                        <img src={category.categoryImage} alt={category.categoryTitle} className="w-8 h-8 rounded-full shadow-sm"/>
                                        {category.categoryTitle}
                                    </NavLink>))
                            )
                            : (
                                <Skeleton count={12} className="m-2 p-2"/>
                            )
                        }
                    </div>
                </div>

                {/* third child in a flex col container */}
                { user && (
                    <Link to={`/user-profile/${user._id}`}
                        className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 border border-whitesmoke-500"
                        onClick={handleCloseSidebar}
                    >
                        <img src={user.userImgUrl}  alt={user.userName} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer"/>
                        <p>{user.userName}</p>
                        <IoIosArrowForward />
                    </Link>
                )}

            </div>
        </>
    )
}

export default Sidebar