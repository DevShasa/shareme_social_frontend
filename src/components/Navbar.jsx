import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchTerm, setSearchTerm ,user }) => {

    const navigate = useNavigate();


    return (
        <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7" >
            <div className="flex justify-start items-center flex-auto px-2 rounded-md bg-white border-none outline-none focus-within:shadow-lg" >
                <IoMdSearch fontSize={21} className="ml-1"/>
                <input 
                    type="text"
                    onChange = {(e)=> setSearchTerm(e.targetvalue)}
                    placeholder="Search"
                    value={searchTerm}
                    onFocus={()=>navigate('/search')}
                    className="p-2 w-full bg-white outline-none"
                />
            </div>
            <div className="flex gap-3">
                <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                    <img src={user?.userImgUrl}  alt="user Name" className="w-9 h-9 rounded-full" referrerPolicy="no-referrer"/>
                </Link>
                <Link to='/create-pin' className="bg-black text-white w-9 h-9 rounded-full flex justify-center items-center">
                    <IoMdAdd />
                </Link>
            </div>
        </div>
    )
}

export default Navbar