import React, { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setLoopData } from '../redux/loopSlice'

function getAllLoops() {
    const dispatch = useDispatch()
    const {userData} = useSelector((state) => state.user)
  useEffect(()=>{
    const fetchLoops = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/loop/getAll`,{withCredentials:true})
            dispatch(setLoopData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchLoops()
  },[dispatch,userData])
}

export default getAllLoops
