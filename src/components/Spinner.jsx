import React from 'react'
import { Grid } from "react-loader-spinner";

function Spinner({message}) {
    return(
        <div className="flex flex-col justify-center items-center w-full h-full">
            <Grid 
                color="#00BFFF"
                height={100} 
                width={100}
                className="m-5"
            />
            <p className="text-lg text-center px-2 pt-3">{message}</p>
        </div>
    )
}

export default Spinner