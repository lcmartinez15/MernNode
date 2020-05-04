import axios from "axios";
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT,
} from "./types";
import { setAlert } from "./alert";

//Get Post
export const getPosts = () => async(dispatch) => {
    try {
        const res = await axios.get("/api/posts");
        //console.log("data user" + res);
        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Add Likes
export const addLikes = (id) => async(dispatch) => {
    try {
        console.log("like", id);
        const res = await axios.put(`/api/posts/like/${id}`);
        console.log("data user" + res);
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Remove Likes
export const removeLikes = (id) => async(dispatch) => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);
        //console.log("data user" + res);
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//delete post
export const deletePost = (id) => async(dispatch) => {
    try {
        const res = await axios.delete(`/api/posts/${id}`);
        //console.log("data user" + res);
        dispatch({
            type: DELETE_POST,
            payload: { id, likes: res.data },
        });
        dispatch(setAlert("post removed"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Add post
export const addPost = (formData) => async(dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post("/api/posts/", formData, config);
        //console.log("create profile");
        dispatch({
            type: ADD_POST,
            payload: res.data,
        });

        dispatch(setAlert("Post created", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Get Post
export const getPost = (id) => async(dispatch) => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        //console.log("data user" + res);
        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Add comment
export const addComment = (postId, formData) => async(dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post(
            `/api/posts/comment/${postId}`,
            formData,
            config
        );
        //console.log("create profile");
        dispatch({
            type: ADD_COMMENT,
            payload: res.data,
        });

        dispatch(setAlert("comment added", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};
//delete comment
export const deleteComment = (postId, commentId) => async(dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        //console.log("create profile");
        dispatch({
            type: REMOVE_COMMENT,
            payload: res.data,
        });

        dispatch(setAlert("comment removed", "success"));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};