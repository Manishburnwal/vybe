import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { getAllStories, getStoryByUserName, uploadStory, viewerStory } from '../controllers/story.controllers.js';

const storyRouter = express.Router();

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory);
storyRouter.get("/getbyusername/:userName",isAuth,getStoryByUserName);
storyRouter.get("/getAll",isAuth,getAllStories);
storyRouter.get("/view/:storyId",isAuth,viewerStory);

export default storyRouter;