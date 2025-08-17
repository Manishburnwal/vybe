import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const uploadStory=async (req,res)=>{
    try {
        const user = await User.findById(req.userId);
        if(user.story){
            // If a story already exists, delete the old one
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }
        const {mediaType} = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({message: "media is required"});
        }
        const story = await Story.create({
            author: req.userId,
            mediaType,
            media
        })
        user.story = story._id;
        await user.save();
        const populatedStory=await Story.findById(story._id).populate("author", "name userName profileImage")
        .populate("viewers", "name userName profileImage");
        return res.status(201).json(populatedStory);    
    } catch (error) {
        return res.status(500).json({message: `upload story error ${error.message}`});
    }
}

export const viewerStory=async (req,res)=>{
    try {
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);
        if(!story){
            return res.status(404).json({message: "Story not found"});
        }
        // Check if the viewer is already in the viewers list
        const viewersIds = story.viewers.map(viewer => viewer._id.toString());
        if(!viewersIds.includes(req.userId.toString())){
            // Add the viewer to the viewers list
            story.viewers.push(req.userId);
            await story.save();
        }
        // Populate the author and viewers fields
        const populatedStory=await Story.findById(story._id).populate("author", "name userName profileImage")
        .populate("viewers", "name userName profileImage");
        return res.status(201).json(populatedStory);
    } catch (error) {
        return res.status(500).json({message: `viewer story error ${error.message}`});  
    }
}

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const story = await Story.findOne({ author: user._id }).populate("viewers author");
        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json({message: `get story by username error ${error.message}`});
    }
}

export const getAllStories = async (req,res)=>{
    try {
        const currentUser = await User.findById(req.userId)
        const followingIds = currentUser.following

        const stories = await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author")
        .sort({createdAt:-1})

        return res.status(200).json(stories);
    } catch (error) {
        return res.status(500).json({message: `All Story get error ${error.message}`});
    }
}