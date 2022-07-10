import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
// import { FcGoogle } from 'react-icons/fc';
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";

const Login = () => {

    function googleLoginResponse(response){
        localStorage.setItem("userToken", JSON.stringify(response.credential))
        var decoded = jwt_decode(response.credential)
        const { email, name, picture, sub} = decoded

        const document = {
            _id: sub,
            type: 'user',
            userName: name,
            userImgUrl: picture,
            email: email
        }
    }

    return (
        <div className="flex flex-col justify-start items-center h-screen">
            <div className="relative w-full h-full">
                <video className="w-full h-full object-cover"
                    src={shareVideo} 
                    type="video/mp4"
                    controls={false}
                    muted
                    autoPlay
                    loop
                />
                <div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
                    <div className="p-5">
                        <img src={logo} alt="logo" width="130px"/>
                    </div>
                    <div className="shadow-2xl">
                        <GoogleLogin 
                            onSuccess={(res)=>googleLoginResponse(res)}
                            onError={console.log('< THE LOGIN HAS FAILED CHUGONDU??> ')}
                            text = "signin_with"
                            shape="pill"
                            logo_alignment='left'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login