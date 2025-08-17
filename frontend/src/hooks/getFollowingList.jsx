import React, { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

function getFollowingList() {
    const dispatch = useDispatch()
    const {storyData} = useSelector((state) => state.story);
  useEffect(()=>{
    const fetchUser = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/user/followingList`,{withCredentials:true})
            dispatch(setFollowing(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchUser()
  },[storyData])
}

export default getFollowingList
