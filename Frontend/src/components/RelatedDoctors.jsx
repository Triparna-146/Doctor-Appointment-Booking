import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality, docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        const doctorData = doctors.filter((doc) => doc.speciality === speciality && doc._id != docId) 
        setRelDoc(doctorData)
    },[doctors, speciality, docId])


  return (
    <div className='flex flex-col items-center gap-4 text-gray-900 my-16 md:mx-10'>
        <h1 className='text-3xl font-medium'>Related Doctors</h1>
        <p className='sm:w-1/3 text-center text-sm'>SSimply browse through our extensive list of trusted doctors.</p>
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {relDoc.slice(0,5).map((item, index) => (
                <div onClick={() => {navigate(`/appointments/${item._id}`); scrollTo(0, 0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                    <img className='bg-blue-50' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-xs text-center text-green-500'>
                            <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                        </div>
                        <p className='text-gray-900 text-md font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-xs'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        {/* <button onClick={() => {navigate('/doctors'); scrollTo(0, 0)}} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-7'>more</button> */}
    </div>
  )
}

export default RelatedDoctors
