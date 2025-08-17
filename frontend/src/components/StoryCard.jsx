import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa";

function StoryCard({ storyData }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  // ✅ Guard: If no storyData yet, don't try to render
  if (!storyData) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 relative flex flex-col justify-center items-center">
      <div className="flex items-center gap-[10px] absolute top-[30px] left-[20px]">
        <IoIosArrowRoundBack
          onClick={() => navigate("/")}
          className="text-white w-[27px] h-[27px] cursor-pointer"
        />
        <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
          <img
            src={storyData.author?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="w-[120px] font-semibold truncate text-white">
          {storyData.author?.userName}
        </div>
      </div>

      <div className="absolute top-[10px] bottom-0 w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {!showViewers && (
        <>
          <div className="w-full h-[90vh] flex items-center justify-center">
            {storyData.mediaType === "image" && (
              <div className="w-[90%] flex items-center justify-center">
                <img
                  src={storyData.media}
                  alt=""
                  className="w-[80%] rounded-2xl object-cover"
                />
              </div>
            )}

            {storyData.mediaType === "video" && (
              <div className="w-[80%] flex flex-col items-center justify-center">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          {storyData?.author.userName == userData?.userName && (
            <div className="w-full h-[70px] flex items-center gap-[10px] text-white bottom-0 p-2 left-0 absolute cursor-pointer" onClick={()=>setShowViewers(true)}>
              <div className="text-white flex items-center gap-[5px]">
                <FaEye />
                {storyData.viewers.length}
              </div>
              <div className="flex relative">
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div
                    key={viewer._id || index}
                    className="w-[30px] h-[30px] rounded-full overflow-hidden cursor-pointer border-2 border-black absolute"
                    style={{
                      left: `${index * 18}px`, // Adjust spacing as needed
                      zIndex: 3 - index, // Higher z-index for earlier viewers
                    }}
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showViewers && (
        <>
          <div className="w-full h-[30%] mt-[100px] flex items-center justify-center overflow-hidden cursor-pointer py-[30px]" onClick={()=>setShowViewers(false)}>
            {storyData.mediaType === "image" && (
              <div className="h-full flex items-center justify-center">
                <img
                  src={storyData.media}
                  alt=""
                  className="h-full rounded-2xl object-cover"
                />
              </div>
            )}

            {storyData.mediaType === "video" && (
              <div className="h-full flex flex-col items-center justify-center">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>
          <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]">
            <div className="text-white flex items-center gap-[10px]">
              <FaEye />
              <span>{storyData?.viewers?.length}</span>
              <span>Viewers</span>
            </div>
            <div className="w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px] ">
        {storyData?.viewers?.map((viewer, index) => (
          <div className="w-full flex items-center gap-[20px]">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden cursor-pointer border-2 border-black">
              <img
                src={viewer?.profileImage || dp}
                alt=""
                className="w-full object-cover"
              />
            </div>
            <div className="w-[120px] font-semibold truncate text-white">
              {viewer?.userName}
            </div>
          </div>
        ))}
      </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StoryCard;
