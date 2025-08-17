import React, { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationData } from '../redux/userSlice'

function getAllNotifications() {
    const dispatch = useDispatch()
    const {notificationData} = useSelector((state) => state.user)
    useEffect(()=>{
        const fetchNotifications = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/user/getAllNotifications`,{withCredentials:true})
                dispatch(setNotificationData(result.data))
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchNotifications()
    },[dispatch])
}

export default getAllNotifications
