import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineInsertComment } from "react-icons/md";
import { MdBookmarkBorder } from "react-icons/md";
import { MdOutlineBookmark } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { server_url } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { postData } = useSelector((state) => state.post);
  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${server_url}/api/post/like/${post._id}`,
        { withCredentials: true }
      );
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    try {
      const result = await axios.post(
        `${server_url}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await axios.get(
        `${server_url}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  useEffect(()=>{
    socket?.on("likedPost",(updatedData)=>{
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId ? {...p,likes:updatedData.likes} : p
      );
      dispatch(setPostData(updatedPosts))
    })
    socket?.on("commentedPost",(updatedData)=>{
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId ? {...p,comments:updatedData.comments} : p
      );
      dispatch(setPostData(updatedPosts))
    })

    return ()=>{socket?.off("likedPost")
                socket?.off("commentedPost")}
  },[socket,postData,dispatch])

  return (
    <div className="w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-5">
      <div className="w-full h-[80px] flex justify-between items-center px-[10px]">
        <div className="flex justify-center items-center gap-[10px] md:gap-5" onClick={()=>navigate(`/profile/${post?.author?.userName}`)}>
          <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="w-[150px] font-semibold truncate">
            {post.author.userName}
          </div>
        </div>
        {userData._id!=post.author._id && <FollowButton tailwind={"px-[10px] min-w-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px] cursor-pointer"} targetUserId={post.author._id}/>}
      </div>

      <div className="w-[90%] flex items-center justify-center">
        {post.mediaType == "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={post.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {post.mediaType == "video" && (
          <div className="w-[80%] flex flex-col items-center justify-center">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      <div className="w-full h-[60px] flex justify-between items-center px-5 mt-[10px]">
        <div className="flex justify-center items-center gap-[10px]">
          <div className="flex justify-center items-center gap-[5px]">
            {!post.likes.includes(userData._id) && (
              <GoHeart
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={handleLike}
              />
            )}
            {post.likes.includes(userData._id) && (
              <GoHeartFill
                className="w-[25px] h-[25px] cursor-pointer text-red-600"
                onClick={handleLike}
              />
            )}
            <span>{post.likes.length}</span>
          </div>
          <div
            className="flex justify-center items-center gap-[5px]"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <MdOutlineInsertComment className="w-[25px] h-[25px] cursor-pointer" />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={handleSave}>
  {!userData?.saved?.some(
    (savedPost) => savedPost._id?.toString() === post?._id.toString()
  ) && (
    <MdBookmarkBorder className="w-[25px] h-[25px] cursor-pointer" />
  )}
  {userData?.saved?.some(
    (savedPost) => savedPost._id?.toString() === post?._id.toString()
  ) && (
    <MdOutlineBookmark className="w-[25px] h-[25px] cursor-pointer" />
  )}
</div>
      </div>

      {post.caption && (
        <div className="w-full px-5 gap-[10px] flex justify-start items-center">
          <h1 className="font-bold">{post.author.userName}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {showComments && (
        <div className="w-full flex flex-col gap-[30px] pb-5">
          <div className="w-full h-[80px] flex items-center justify-between px-5 relative">
            <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
              <img
                src={post.author?.profileImage || dp}
                alt=""
                className="w-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]"
              placeholder="Write Comment..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              className="absolute right-5 cursor-pointer"
              onClick={handleComment}
            >
              <IoSend className="w-[25px] h-[25px]" />
            </button>
          </div>

          <div className="w-full max-h-[300px] overflow-auto">
            {post.comments?.map((com, index) => (
              <div
                key={index}
                className="w-full px-5 py-5 flex items-center gap-5 border-b-2 border-b-gray-200"
              >
                <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
                  <img
                    src={com.author.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
                <div>{com.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
