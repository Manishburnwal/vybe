import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnlineUsers from '../components/OnlineUsers';
import { setSelectedUser } from '../redux/messageSlice';
import dp from "../assets/dp.webp"

function Messages() {
    const navigate = useNavigate()
    const {userData} = useSelector(state=>state.user)
    const {onlineUsers} = useSelector(state=>state.socket)
    const {prevChatUsers,selectedUser} = useSelector(state=>state.message)
    const dispatch = useDispatch()
  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
            <IoIosArrowRoundBack onClick={() => navigate('/')} className='text-white w-[27px] lg:hidden h-[27px] cursor-pointer' />
            <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
        </div>

        <div className='w-full h-[80px] flex gap-5 justify-start items-center overflow-x-auto p-5 border-b-2 border-gray-800'>
            {userData.following?.map((user,index)=>(
                (onlineUsers?.includes(user._id)) && <OnlineUsers key={user._id || index} user={user}/>
            ))}
        </div>

        <div className='w-full h-full overflow-auto flex flex-col gap-[20px]'>
            {prevChatUsers?.map((user,index)=>(
                <div key={user._id || index} className='w-full text-white cursor-pointer flex items-center gap-[10px]' onClick={()=>{
                    dispatch(setSelectedUser(user))
                    navigate("/messageArea")
                }}>
                    {onlineUsers?.includes(user._id)?<OnlineUsers user={user}/>:<div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer border-2 border-black'>
                        <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
                    </div>}
                    <div className='flex flex-col'>
                        <div className='text-white text-[18px] font-semibold'>{user?.userName}</div>
                        {onlineUsers?.includes(user?._id) && <div className='text-blue-500 text-[15px]'>Active Now</div>}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Messages