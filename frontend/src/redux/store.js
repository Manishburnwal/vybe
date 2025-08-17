import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';
import postSlice from './postSlice';
import loopSlice from './loopSlice';
import storySlice from './storySlice';
import messageSlice from './messageSlice'
import socketSlice from './socketSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        post: postSlice,
        loop: loopSlice,
        story: storySlice,
        message: messageSlice,
        socket: socketSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'socket/setSocket',
                    // Add other socket-related actions here
                ],
                // Ignore these field paths in all actions
                ignoredPaths: [
                    'socket.socket',
                    // Add other socket-related paths here
                ],
            },
        }),
})