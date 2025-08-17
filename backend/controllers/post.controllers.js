import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async (req,res) =>{
    try {
        const {caption,mediaType} = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path);
        } else {
            return res.status(400).json({message: "media is required"});
        }
        const post = await Post.create({
            caption,media,mediaType,author: req.userId
        })
        const user = await User.findById(req.userId);
        user.posts.push(post._id);
        await user.save();
        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage");
        return res.status(201).json(populatedPost);
    } catch (error) {
        return res.status(500).json({message: `upload post error ${error.message}`});
    }
}

export const getAllPosts = async (req,res) =>{
    try {
        const posts = await Post.find({})
        .populate("author", "name userName profileImage").sort({createdAt:-1})
        .populate("comments.author", "name userName profileImage").sort({createdAt:-1});
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({message: `get all posts error ${error.message}`});
    }
}

export const like=async (req,res)=>{
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }
        const alreadyLiked = post.likes.some(id=> id.toString() === req.userId.toString());
        if(alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId.toString());
        } else {
            post.likes.push(req.userId);
            if(post.author._id!=req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver:post.author._id,
                    type:"like",
                    post:post._id,
                    message:"liked your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }
        await post.save();
        await post.populate("author", "name userName profileImage");
        io.emit("likedPost",{
            postId:post._id,
            likes:post.likes
        })

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message: `like post error ${error.message}`});
    }
}

export const comment=async (req,res)=>{
    try {
        const {message} = req.body;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }
        post.comments.push({
            author:req.userId,
            message
        })
        if(post.author._id!=req.userId){
            const notification = await Notification.create({
                sender:req.userId,
                receiver:post.author._id,
                type:"comment",
                post:post._id,
                message:"commented on your post"
            })
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
            const receiverSocketId = getSocketId(post.author._id)
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newNotification",populatedNotification)
            }
        }
        await post.save();
        await post.populate("author", "name userName profileImage");
        await post.populate("comments.author");

        io.emit("commentedPost",{
            postId:post._id,
            comments:post.comments
        })
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message: `comment on post error ${error.message}`});
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);
        const alreadySaved = user.saved.some(id=> id.toString() === postId.toString());
        
        if(alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() !== postId.toString());
        } else {
            user.saved.push(postId);
        }
        
        await user.save();
        
        // Add the same populate as getCurrentUser
        const updatedUser = await User.findById(req.userId).populate("posts loops posts.author posts.comments saved saved.author").select("-password");
        return res.status(200).json(updatedUser);
        
    } catch (error) {
        return res.status(500).json({message: `saved post error ${error.message}`});
    }
}