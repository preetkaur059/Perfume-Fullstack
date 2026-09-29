import React from 'react'

const Heading = ({ highlight }) => {
    return (
        <div>
            <h1 className="text-[#e2f2b0] text-[3.8rem]  font-allura md:text-[4.5rem] text-[3rem]">
                {highlight}
            </h1>
        </div>
    )
}

export default Heading
