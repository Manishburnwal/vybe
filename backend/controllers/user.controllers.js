import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import { getSocketId, io } from "../socket.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }
        const user = await User.findById(userId).populate("posts loops posts.author posts.comments saved saved.author story following").select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Get Current User error: ${error.message}` });
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: `get Suggested Users error: ${error.message}` });
    }
}

export const editProfile = async (req, res) => {
    try {
        const {name,userName,bio,profession,gender} = req.body;
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const sameUserWithUserName=await User.findOne({userName}).select("-password");

        if(sameUserWithUserName && sameUserWithUserName._id != req.userId) {
            return res.status(400).json({ message: "Username already exists" });
        }

        let profileImage;
        if(req.file){
            profileImage = await uploadOnCloudinary(req.file.path);
        }
        user.name = name;
        user.userName = userName;
        if(profileImage){
            user.profileImage = profileImage;
        }
        user.bio = bio;
        user.profession = profession;
        user.gender = gender;

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Edit Profile error: ${error.message}` });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName }).select("-password").populate("posts loops followers following");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Get Profile error: ${error.message}` });
    }
}

export const follow=async(req,res)=>{
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.targetUserId;

        if(!targetUserId){
            return res.status(400).json({ message: "Target user is not found" });
        }
        if(currentUserId == targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }
        const currentUser=await User.findById(currentUserId).select("-password");
        const targetUser=await User.findById(targetUserId).select("-password");

        const isFollowing = currentUser.following.includes(targetUserId);
        if(isFollowing){
            currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ 
                following: false,
                message: "Unfollowed successfully",
            });
        } else {
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
            if(currentUser._id!=targetUser._id){
                const notification = await Notification.create({
                    sender:currentUser._id,
                    receiver:targetUser._id,
                    type:"follow",
                    message:"started following you"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")
                const receiverSocketId = getSocketId(targetUser._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
              }
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({ 
                following: true,
                message: "Followed successfully"
            });
        }
    } catch (error) {
        return res.status(500).json({ message: `Follow/Unfollow error: ${error.message}` });
    }
}

export const followingList=async (req,res)=>{
    try {
        const result = await User.findById(req.userId)
        return res.status(200).json(result?.following)
    } catch (error) {
        return res.status(500).json({message: `following error ${error}`})
    }
}

export const search=async (req,res)=>{
    try {
        const keyWord=req.query.keyword
        if(!keyWord){
            return res.status(400).json({message:"keyword is required.."});
        }
        const users = await User.find({
            $or:[
                {userName:{$regex:keyWord,$options:"i"}},
                {name:{$regex:keyWord,$options:"i"}}
            ]
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({message: `search error ${error}`})
    }
}

export const getAllNotifications = async (req, res) => {
    try {
        console.log('Controller - req.userId:', req.userId)
        
        if (!req.userId) {
            console.log('No userId found in request')
            return res.status(401).json({message: 'User not authenticated'})
        }
        
        const notifications = await Notification.find({
            receiver: req.userId
        }).populate("sender receiver post loop").sort({createdAt:-1})
        
        console.log('Found notifications:', notifications.length)
        
        return res.status(200).json(notifications)
    } catch (error) {
        console.log('Error in getAllNotifications:', error)
        return res.status(500).json({message: `get notification error ${error}`})
    }
}

export const markAsRead=async (req,res)=>{
    try {
        const {notificationId} = req.body
        if(Array.isArray(notificationId)){
            // bulk mark as read
            await Notification.updateMany(
                { _id: { $in: notificationId }, receiver: req.userId },
                { $set: { isRead:true }}
            );
        } else {
            // mark single notification as read
            await Notification.findOneAndUpdate(
                { _id: notificationId, receiver: req.userId },
                { $set: { isRead:true }}
            );
        }
        return res.status(200).json({message:"marked as read"}) 
    } catch (error) {
        return res.status(500).json({message:`read notification error ${error}`})
    }
}