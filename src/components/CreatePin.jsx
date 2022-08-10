import {useState} from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { client } from "../sanity/client";
import { useNavigate } from  "react-router-dom";
import Spinner from "./Spinner";
import { categoriesFromStore } from "../reduxStore/dataSlices/categorySlice";
// import { BsChevronCompactLeft } from 'react-icons/bs';

const CreatePin = ({ user }) => {
    const [ loading, setLoading ] = useState(false)
    const [ title, setTitle ] =  useState("")
    const [ about, setAbout ] = useState("")
    const [ destination, setDestination ] = useState("")
    const [ category, setCategory ] = useState()
    const [ imageAsset, setImageAsset ] = useState()
    const [ fileNotAnImage, setFileNotAnImage ] = useState()

    const categoryList = useSelector(categoriesFromStore)

    const navigate = useNavigate();

    const allfieldsArePresent = [title, about, destination, imageAsset?._id, category].every(Boolean)

    const uploadImage = (e)=>{
        const selectedFile = e.target.files[0]
        console.log('FILE->>>>',selectedFile)
        const correctFIleType = selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/jpg'|| selectedFile.type === 'image/webp'
        if(correctFIleType){
            setFileNotAnImage(false)
            setLoading(true)
            client.assets
                .upload('image', selectedFile, {
                    // image upload options 
                    contentType: selectedFile.type,
                    filename: selectedFile.name
                })
                .then((document)=>{
                    // sanity returns the uploaded document and we decide what to do with it
                    setImageAsset(document)
                    console.log('SANITY FILE UPLOAD----->',document)
                    setLoading(false)
                }).catch((error)=>{
                    console.log("The upload has failed >> ", error.message)
                })
        }else{
            setLoading(false)
            setFileNotAnImage(true)
        }
    }

    const deleteImage = (imageId) =>{
        setLoading(true)
        client.delete(imageId).then(result=>{
            console.log("Image sucessfuly deleted")
            setImageAsset(null)
            setLoading(false)
        })
    }

    const createNewPin = ()=>{
        if(allfieldsArePresent){
            setLoading(true)
            const doc = {
                _type: 'pin',
                title, about, destination,
                image: {
                    _type: 'image',
                    asset:{
                        _type: 'reference',
                        _ref: imageAsset?._id
                    },
                },
                userId: user._id,
                postedBy:{
                    _type:'postedBy',
                    _ref:user._id 
                },
                category:{
                    _type:'assocCategory',
                    _ref: category
                }
            }
            client.create(doc).then((data)=>{
                console.log("DATA UPLOADED TO SANITY------>", data)
                setLoading(false)
                navigate("/")
            })            
        }else{
            window.alert("Please input all fields")
        }
    }

    return (
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
            {!allfieldsArePresent && (
                <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                    Please add all fields
                </p>
            )}
            <div className="flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                    <div className="flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420">
                        {/* {loading && <Spinner />} */}
                        {fileNotAnImage && <p>Wrong file type</p>}
                        {loading ? <Spinner /> : !imageAsset //image has not been saved and thus asset not set
                        ?(
                            <label >
                                <div className="flex flex-col items-center justify-center h-full ">
                                    <div className="flex flex-col justify-center items-center ">
                                        <p className="font-bold text-2xl"><AiOutlineCloudUpload /></p>
                                        <p className="text-lg">Click to Upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400">
                                        Reccomendation: use High Quality images
                                    </p>
                                </div>
                                <input 
                                    type="file"
                                    name="upload-image"
                                    onChange={uploadImage}
                                    className="w-0 h-0"
                                />
                            </label>
                        ):(
                            <div className='relative h-full'>
                                <img src={imageAsset?.url} alt="uploaded-pic" className='h-full w-full'/>
                                <button type="button" onClick={()=>deleteImage(imageAsset?._id)}
                                    className="absolute bottom-3 right-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* ---------------------------------------------------------------------------------------------------- */}
                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    <input 
                        type="text"
                        value={title}
                        onChange = {(e)=> setTitle(e.target.value)}
                        placeholder="Pin title"
                        className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
                    />
                    {user &&(
                        <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg">
                            <img
                                src={user.userImgUrl}
                                alt="user-profile"
                                className="w-10 h-10 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                            <p className="font-bold">{user.userName}</p>
                        </div>
                    )}
                    <input 
                        type="text"
                        value={destination}
                        onChange = {(e)=> setDestination(e.target.value)}
                        placeholder="Add a destination link"
                        className='outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
                    />
                    <input 
                        type="text"
                        value={about}
                        onChange = {(e)=> setAbout(e.target.value)}
                        placeholder="Tell everyone what your Pin is about"
                        className='outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
                    />
                    <div className="fkex flex-col">
                        <div>
                            <p className="mb-2 font-semibold text:lg sm:text-xl">
                                Choose Pin Category
                            </p>
                            <select
                                onChange ={(e)=>setCategory(e.target.value)}
                                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                {categoryList.map((item)=>(
                                    <option key={item._id} value={item._id}
                                        className="text-base border-0 outline-none capitalize bg-white text-black"
                                    >
                                        {item.categoryTitle}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-end items-end mt-5'>
                            <button type="button"
                                onClick = {createNewPin}
                                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                                disabled = {!allfieldsArePresent}
                                style={{ cursor: allfieldsArePresent ? "pointer" : "not-allowed"}}
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePin