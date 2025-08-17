import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { server_url } from '../App';
import { setNotificationData } from '../redux/userSlice';

function Notifications() {
    const navigate = useNavigate();
    const notificationData = useSelector(state=>state.user.notificationData)
    const ids = notificationData.map((n)=>n._id)
    const dispatch = useDispatch()
    const markAsRead=async ()=>{
        try {
            const result = await axios.post(`${server_url}/api/user/markAsRead`,{notificationId:ids},{withCredentials:true})
            await fetchNotifications()
        } catch (error) {
            console.log(error)
        }
    }
    const fetchNotifications = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/user/getAllNotifications`,{withCredentials:true})
            dispatch(setNotificationData(result.data))
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        markAsRead()
    },[])
  return (
    <div className='w-full h-screen bg-black overflow-auto'>
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
            <IoIosArrowRoundBack onClick={() => navigate('/')} className='text-white w-[27px] h-[27px] cursor-pointer' />
            <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
        </div>

        <div className='w-full h-[100%] flex flex-col gap-5 px-[10px]'>
        {notificationData.map((noti, index) => (
            <NotificationCard noti={noti} key={index} />
        ))}

        </div>
    </div>
  )
}

export default Notifications
