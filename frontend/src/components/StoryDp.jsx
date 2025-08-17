import React, { useEffect, useState } from 'react'
import dp from '../assets/dp.webp'
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server_url } from '../App';

function StoryDp({profileImage,userName,story}) {
    const navigate = useNavigate();
    const {userData}=useSelector((state) => state.user);
    const {storyData,storyList}=useSelector((state) => state.story);
    const [viewed,setViewed]=useState(false)

    useEffect(()=>{
        if(story?.viewers?.some((viewer)=>
            viewer?._id?.toString()===userData._id.toString() || viewer?.toString()==userData._id.toString()
        )){
            setViewed(true)
        } else {
            setViewed(false)
        }
    },[story,userData,storyData,storyList])

    const handleViewers=async()=>{
        try {
            const result = await axios.get(`${server_url}/api/story/view/${story._id}`,{withCredentials:true})
        } catch (error) {
            console.log(error)
        }
    }

    // Check if user has stories - works for both arrays and other data types
    const hasStory = story && (Array.isArray(story) ? story.length > 0 : true);

    const handleClick = () => {
        if(!hasStory && userName=="Your Story") {
            navigate("/upload");
        }
        else if(hasStory && userName=="Your Story") {
            handleViewers()
            navigate(`/story/${userData.userName}`);
        }
        else{
            handleViewers()
            navigate(`/story/${userName}`);
        }
    }
    
    return (
        <div className='flex flex-col w-[80px]'>
            <div className={`w-[80px] h-[80px] ${!hasStory?null:!viewed?"bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-r from-gray-500 to-black-800"} rounded-full flex items-center justify-center relative`} onClick={handleClick}>
                <div className='w-[70px] h-[70px] rounded-full overflow-hidden cursor-pointer border-2 border-black'>
                    <img src={profileImage || dp} alt="" className='w-full object-cover'/>
                    {!hasStory && userName=="Your Story" && 
                        <HiOutlinePlusCircle className='text-black bg-white absolute bottom-[6px] right-[8px] rounded-full h-[22px] w-[22px]'/>
                    }
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
        </div>
    )
}

export default StoryDp