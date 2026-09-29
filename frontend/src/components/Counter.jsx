import React from 'react'
import { useState } from 'react'


const Counter = () => {
    const [count, setCount] = useState(1);
    const handleChange = () => {
        setCount(prev => prev + 1);
        console.log(count);

    }


    return (
        <div>
            <h1>counter</h1>
            <p >  </p>
            <button className='py-4 px-2 bg-orange-200' onClick={handleChange}>1</button>
        </div>
    )
}


export default Counter



