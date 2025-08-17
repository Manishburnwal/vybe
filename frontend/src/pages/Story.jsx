import axios from 'axios';
import React, { useEffect } from 'react'
import { server_url } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setStoryData } from '../redux/storySlice';
import StoryCard from '../components/StoryCard';
import { useParams } from 'react-router-dom';

function Story() {
    const {userName} = useParams();
    const {storyData} = useSelector((state) => state.story);
    const dispatch = useDispatch();
    const handleStory = async () => {
      dispatch(setStoryData(null))
        try {
            const result = await axios.get(`${server_url}/api/story/getbyusername/${userName}`, { withCredentials: true });
            dispatch(setStoryData(result.data));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(userName){
            handleStory();
        }
    },[userName])
  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
      <StoryCard storyData={storyData}/>
    </div>
  )
}

export default Story
