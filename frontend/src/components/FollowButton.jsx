import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { server_url } from '../App';
import { toggleFollow } from '../redux/userSlice';

function FollowButton({targetUserId, tailwind,onFollowChange}) {
    const {following}=useSelector((state) => state.user);
    const isFollowing = following.includes(targetUserId);
    const dispatch = useDispatch();
    const handleFollow=async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/user/follow/${targetUserId}`,{withCredentials:true});
            if(onFollowChange){
                onFollowChange();
            }
            dispatch(toggleFollow(targetUserId))
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <button className={tailwind} onClick={handleFollow}>
        {isFollowing?"Following":"Follow"}
    </button>
  )
}

export default FollowButton
