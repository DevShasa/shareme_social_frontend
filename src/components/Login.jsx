import { useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";
import { client } from "../sanity/client";

const Login = () => {

    const navigate = useNavigate();
    function googleLoginResponse(response){
        // Grab the token from the response object and decode it
        var decoded = jwt_decode(response.credential)
        const { email, name, picture, sub} = decoded
        localStorage.setItem("subjectId", JSON.stringify(sub))

        // destructure key info from the decoded token
        const document = {
            _id: sub,
            _type: 'user',
            userName: name,
            userImgUrl: picture,
            email: email
        }

        // Update sanity db with the info
        client.createIfNotExists(document)
            // replace current entry in history stack with homepage("/")
            // so when people click the back button on browser, they ...
            // ... are taken to homepage instead of login page
            .then(()=>{ navigate("/", {replace:true}) })
    }

    useEffect(()=>{
        // redirect if localstorage is not null
        if(localStorage.getItem("subjectId")){
            navigate("/", {replace:true})
        }
    },[navigate])

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