import axios from "axios";
import React, { useEffect, useState } from "react";
import { server_url } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import dp from "../assets/dp.webp";
import { IoIosArrowRoundBack } from "react-icons/io";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";

function Profile() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const { profileData, userData } = useSelector((state) => state.user);
    const { postData } = useSelector((state) => state.post);
    const [postType, setPostType] = useState("posts")
    const navigate = useNavigate();
    
    const handleProfile = async () => {
        try {
            const result = await axios.get(
                `${server_url}/api/user/getprofile/${userName}`,
                { withCredentials: true }
            );
            dispatch(setProfileData(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = async () => {
        try {
            const result = await axios.get(`${server_url}/api/auth/signout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    };

    // Helper function to get positioning classes
    const getPositionClass = (index) => {
        switch (index) {
            case 0: return "";
            case 1: return "-ml-2";
            case 2: return "-ml-4";
            default: return "";
        }
    };

    useEffect(() => {
        handleProfile();
    }, [userName, dispatch]);

    return (
        <div className="w-full min-h-screen bg-black">
            <div className="w-full h-[80px] flex justify-between px-[25px] py-[18px] text-white">
                <div onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack className="text-white w-[27px] h-[27px] cursor-pointer" />
                </div>
                <div className="font-semibold text-[18px]">{profileData?.userName}</div>
                <div
                    className="font-semibold cursor-pointer text-blue-500 text-[18px]"
                    onClick={handleLogout}
                >
                    Log Out
                </div>
            </div>

            <div className="w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
                <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
                    <img
                        src={profileData?.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <div className="text-white font-semibold text-[22px]">
                        {profileData?.name}
                    </div>
                    <div className="text-[17px] text-[#ffffffe8]">
                        {profileData?.profession || "New User"}
                    </div>
                    <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
                </div>
            </div>

            <div className="w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white">
                <div>
                    <div className="text-white text-[22px] md:text-[30px] font-semibold">
                        {profileData?.posts?.length || 0}
                    </div>
                    <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
                        Posts
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-5">
                        <div className="flex items-center">
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user._id || index}
                                    className={`w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer border-2 border-white relative z-${3-index} ${getPositionClass(index)}`}
                                >
                                    <img
                                        src={user.profileImage || dp}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-white text-[22px] md:text-[30px] font-semibold">
                            {profileData?.followers?.length || 0}
                        </div>
                    </div>
                    <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
                        Followers
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-5">
                        <div className="flex items-center">
                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user._id || index}
                                    className={`w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer border-2 border-white relative z-${3-index} ${getPositionClass(index)}`}
                                >
                                    <img
                                        src={user.profileImage || dp}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-white text-[22px] md:text-[30px] font-semibold">
                            {profileData?.following?.length || 0}
                        </div>
                    </div>
                    <div className="text-[18px] md:text-[22px] text-[#ffffffc7]">
                        Following
                    </div>
                </div>
            </div>

            <div className="w-full h-[80px] flex justify-center items-center gap-5 mt-[10px]">
                {profileData?._id == userData._id && (
                    <button
                        className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl"
                        onClick={() => navigate("/editprofile")}
                    >
                        Edit Profile
                    </button>
                )}

                {profileData?._id != userData._id && (
                    <>
                        <FollowButton
                            tailwind={
                                "px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl"
                            }
                            targetUserId={profileData?._id}
                            onFollowChange={handleProfile}
                        />
                        <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl" onClick={()=>{
                            dispatch(setSelectedUser(profileData))
                            navigate("/messageArea")
                        }}>
                            Message
                        </button>
                    </>
                )}
            </div>

            <div className="w-full min-h-[100vh] flex justify-center">
                <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]">
                    {profileData?._id == userData?._id && <div className='w-[90%] max-w-[500px] h-[80px] bg-white rounded-full flex justify-center items-center gap-[10px]'>
                        <div className={`${postType == 'posts' ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("posts")}>Posts</div>

                        <div className={`${postType == 'saved' ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("saved")}>Saved</div>
                    </div>}

                    <Nav />

                    {profileData?._id === userData?._id && (
                        <>
                            {postType === "posts" &&
                                postData
                                    .filter((post) => post.author?._id === profileData?._id)
                                    .map((post) => <Post key={post._id} post={post} />)}

                            {postType === "saved" &&
                                postData
                                    .filter((post) =>
                                        userData?.saved?.some((savedPost) => savedPost._id?.toString() === post._id.toString())
                                    )
                                    .map((post) => <Post key={post._id} post={post} />)}
                        </>
                    )}

                    {profileData?._id !== userData?._id &&
                        postData
                            .filter((post) => post.author?._id === profileData?._id)
                            .map((post) => <Post key={post._id} post={post} />)}
                </div>
            </div>
        </div>
    );
}

export default Profile;