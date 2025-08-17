import React from 'react'
import logo from '../assets/logo2.png'
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { TbMessage2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


function Feed() {
  const {postData} = useSelector((state) => state.post);
  const {userData,notificationData} = useSelector((state) => state.user);
  const {storyList,currentUserStory} = useSelector((state) => state.story);
  const navigate = useNavigate();
  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
      <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
        <img src={logo} alt="" className='w-[80px]'/>
        <div className='flex items-center gap-[20px]'>
        <div className='relative' onClick={()=>navigate("/notifications")}>
          <FaRegHeart className='text-white h-[25px] w-[25px]'/>
          {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='h-[10px] w-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}
        </div>
        <TbMessage2 className='text-white h-[25px] w-[25px]' onClick={()=>navigate("/messages")}/>
        </div>
      </div>

      <div className='flex w-full overflow-auto gap-[10px] items-center p-[20px]'>
        <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory}/>

        {storyList?.map((story,index)=>(
          <StoryDp userName={story.author.userName} profileImage={story.author.profileImage} story={story} key={index}/>
        ))}
      </div>

      <div className='w-full min-h-[100vh] flex flex-col items-center gap-5 p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
        <Nav/>
        {postData?.map((post,index)=>(
          <Post key={index} post={post}/>
        ))}
      </div>
    </div>
  )
}

export default Feed
