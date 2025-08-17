import React, { useState } from 'react'
import logo from '../assets/logo2.png'
import { FaRegHeart } from "react-icons/fa6";
import dp from '../assets/dp.webp'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { server_url } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';
import Notifications from '../pages/Notifications';

function LeftHome() {
    const {userData,suggestedUsers}=useSelector((state) => state.user); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotification,setShowNotification] = useState(false)
    const {notificationData}=useSelector(state=>state.user)
    const handleLogout=async()=>{
        try {
            const result = await axios.get(`${server_url}/api/auth/signout`,{withCredentials:true});    
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-black border-r-2 border-gray-900 ${showNotification?"overflow-hidden":"overflow-auto"}`}>
      <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
        <img src={logo} alt="" className='w-[80px]'/>
        <div className='relative cursor-pointer z-[100]' onClick={()=>setShowNotification(prev=>!prev)}>
          <FaRegHeart className='text-white h-[25px] w-[25px]'/>
          {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='h-[10px] w-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}
        </div>
      </div>

      {!showNotification && <>
        <div className='flex items-center w-full justify-between gap-[10px] px-[10px] border-b-2 border-b-gray-900 py-[10px]'>
        <div className='flex items-center gap-[10px]'>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer border-2 border-black'>
            <img src={userData.profileImage || dp} alt="" className='w-full object-cover'/>
        </div>
        <div>
            <div className='text-[18px] text-white font-semibold'>{userData.userName}</div>
            <div className='text-[15px] text-gray-400 font-semibold'>{userData.name}</div>
        </div>
        </div>
        <div className='text-blue-500 font-semibold cursor-pointer' onClick={handleLogout}>Log Out</div>
      </div>

      <div className='w-full flex flex-col gap-5 p-5'>
        <h1 className='text-white text-[19px]'>Suggested Users</h1>
        {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
            <OtherUser key={index} user={user} />
        ))}
      </div>
      </>}

      {showNotification && <Notifications/>}

    </div>
  )
}

export default LeftHome
