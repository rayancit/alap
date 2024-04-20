import React from 'react'

const Input = ({ label, ...attributes }) => {
  return (
    <div className='relative mt-10'>
      {
        label && <label htmlFor="" className='top-[-15px] left-5 bg-white absolute text-lg px-2'>{label}</label>
      }
      <input  className='py-3 w-full px-2 border border-black'{...attributes} />
    </div>
  )
}

export default Input