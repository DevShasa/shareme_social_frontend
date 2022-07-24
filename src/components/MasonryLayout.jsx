import React from 'react'
import Masonry from 'react-masonry-css'
import Pin from "./Pin";

const breakpointColumsObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1 
}

function MasonryLayout({pins, setLoading}) {
    return (
        <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumsObj}>
            {pins?.map((pin)=>(
                <Pin 
                    key={pin._id}
                    pin={pin}
                    className="w-max"
                    setLoading = {setLoading}
                />
            ))}
        </Masonry>
    )
}

export default MasonryLayout