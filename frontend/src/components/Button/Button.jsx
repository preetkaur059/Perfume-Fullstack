import React from 'react'

const Button = ({content,onClick}) => {
  return (
    <div>
      <button
      onClick={onClick}
        className=" text-center cursor-pointer mt-4 px-4 py-2 bg-[#e2f2b0] text-black border-2 border-[#f5f5dc] text-[1.3rem] font-bold transition-transform duration-200 hover:scale-[1.03] hover:bg-[#efc3c5]"
      > {content}
      </button>
    </div>
  )
}

export default Button
