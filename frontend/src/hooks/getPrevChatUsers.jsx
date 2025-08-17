import React, { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPrevChatUsers } from '../redux/messageSlice'

function getPrevChatUsers() {
    const dispatch = useDispatch()
    const {messages} = useSelector((state) => state.message);
  useEffect(()=>{
    const fetchUser = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/message/prevChats`,{withCredentials:true})
            dispatch(setPrevChatUsers(result.data))
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchUser()
  },[messages])
}

export default getPrevChatUsers
