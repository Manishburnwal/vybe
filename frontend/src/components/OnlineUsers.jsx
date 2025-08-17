import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/dp.webp"

function OnlineUsers({user}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  return (
    <div className='w-[50px] h-[50px] flex gap-5 justify-start items-center relative'>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer border-2 border-black' onClick={()=>{
            dispatch(setSelectedUser(user))
            navigate(`/messageArea`)
        }}>
            <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
        </div>
        <div className='w-[10px] h-[10px] bg-[#0080ff] rounded-full absolute top-0 right-0'>

        </div>
    </div>
  )
}

export default OnlineUsers
