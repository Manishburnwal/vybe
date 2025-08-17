import React, { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setStoryList } from '../redux/storySlice'

function getAllStories() {
    const dispatch = useDispatch()
    const {userData} = useSelector((state) => state.user);
    const {storyData} = useSelector((state) => state.story);
  useEffect(()=>{
    const fetchStories = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/story/getAll`,{withCredentials:true})
            dispatch(setStoryList(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchStories()
  },[userData,storyData])
}

export default getAllStories
