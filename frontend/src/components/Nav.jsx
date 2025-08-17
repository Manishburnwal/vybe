import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";
import { GoVideo } from "react-icons/go";
import { FaRegPlusSquare } from "react-icons/fa";
import dp from '../assets/dp.webp'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
  const navigate = useNavigate();
  const {userData}=useSelector((state) => state.user);
  return (
    <div className='w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
      <div><GoHomeFill className='text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/></div>
      <div><IoSearchSharp className='text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/search")}/></div>
      <div onClick={()=>navigate("/upload")}><FaRegPlusSquare className='text-white cursor-pointer w-[25px] h-[25px]'/></div>
      <div onClick={()=>navigate("/loops")}><GoVideo className='text-white w-[26px] cursor-pointer h-[26px]'/></div>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer border-2 border-black' onClick={()=>navigate(`/profile/${userData.userName}`)}>
        <img src={userData?.profileImage || dp} alt="" className='w-full object-cover'/>
      </div>
    </div>
  )
}

export default Nav
