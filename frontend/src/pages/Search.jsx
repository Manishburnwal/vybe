import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { server_url } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from "../assets/dp.webp"

function Search() {
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const {searchData} = useSelector((state) => state.user);
    const dispatch = useDispatch()
    
    const handleSearch = async (e) => {
        if (e) e.preventDefault() // Only prevent default if event exists
        
        if (!input.trim()) return // Don't search if input is empty
        
        try {
            const result = await axios.get(`${server_url}/api/user/search?keyword=${input}`, {withCredentials: true})
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        handleSearch() // Called without event parameter
    }, [input])
    
    return (
        <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
                <IoIosArrowRoundBack onClick={() => navigate('/')} className='text-white w-[27px] h-[27px] cursor-pointer' />
            </div>
            <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
                <form onSubmit={handleSearch} className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px] relative'>
                    <FiSearch className='w-[18px] h-[18px] text-white flex-shrink-0'/>
                    <input 
                        type="text" 
                        placeholder='Search...' 
                        className='flex-1 h-full bg-transparent border-none outline-none px-[20px] text-white text-[18px] placeholder-gray-400'
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            caretColor: 'white'
                        }}
                        onChange={(e) => setInput(e.target.value)} 
                        value={input}
                        autoComplete="off"
                        autoFocus
                    />
                </form>
            </div>
            {input && searchData?.map((user)=>(
                <div className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-5 px-[5px] cursor-pointer hover:bg-gray-200' onClick={()=>navigate(`/profile/${user.userName}`)}>
                    <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
                    </div>
                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.userName}</div>
                        <div className='text-[14px] text-gray-400'>{user.name}</div>
                    </div>
                </div>
            ))}

            {!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here...</div>}
        </div>  
    )
}

export default Search