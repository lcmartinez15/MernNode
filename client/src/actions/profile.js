import axios from "axios";

import { setAlert } from "./alert";
import {
    GET_PROFILE,
    PROFILE_ERROR,
    GET_PROFILES,
    UPDTAE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_REPOS,
} from "./types";

// get currrent users profile

export const getCurrentProfile = () => async(dispatch) => {
    try {
        const res = await axios.get("/api/profile/me");
        //console.log("current profile" + res);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: CLEAR_PROFILE,
        });
        if (!error)
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.status,
                    status: error.response.status,
                },
            });
    }
};

// get all profile
export const getProfiles = () => async(dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get("/api/profile");
        //console.log("all profile" + res);
        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (error) {
        if (!error)
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.status,
                    status: error.response.status,
                },
            });
    }
};

// get  profile by id
export const getProfileById = (userId) => async(dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        //console.log("all profile" + res);
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        if (!error)
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.status,
                    status: error.response.status,
                },
            });
    }
};

// get  github repos
export const getGithubRepos = (username) => async(dispatch) => {
    //dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        console.log("data repo client", res);

        dispatch({
            type: GET_REPOS,
            payload: res.data,
        });
    } catch (error) {
        if (!error)
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.status,
                    status: error.response.status,
                },
            });
    }
};

// Create or update User profile

export const createProfile = (formData, history, edit = false) => async(
    dispatch
) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post("/api/profile", formData, config);
        //console.log("create profile");
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
        if (!edit) {
            history.push("/dashboard");
        }
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};

// add experience User profile
export const addExperience = (formData, history) => async(dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.put("/api/profile/experience", formData, config);
        console.log("Add experience");

        dispatch({
            type: UPDTAE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("experience added", "success"));

        history.push("/dashboard");
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};

// add education User profile
export const addEducation = (formData, history) => async(dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.put("/api/profile/education", formData, config);
        console.log("Add education");

        dispatch({
            type: UPDTAE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("education added", "success"));

        history.push("/dashboard");
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};

// Delete experience User profile
export const deleteExperience = (id) => async(dispatch) => {
    try {
        console.log("Delete antes");
        const res = await axios.delete(`/api/profile/experience/${id}`);
        console.log("Delete experience");

        dispatch({
            type: UPDTAE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("experience removed", "success"));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};

// Delete Education User profile
export const deleteEducation = (id) => async(dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        console.log("Delete Education");

        dispatch({
            type: UPDTAE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert("Education removed", "success"));
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
        });
    }
};

// Delete account and profile
export const deleteAccount = () => async(dispatch) => {
    if (window.confirm("Are you sure? This can Not be undone!")) {
        try {
            await axios.delete("/api/profile");
            console.log("Delete Education");

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });

            dispatch(
                setAlert("YOUR ACCOUNT HAS BEEN PERMANANTLY DELETED", "success")
            );
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
            }
            dispatch({
                type: PROFILE_ERROR,
            });
        }
    }
};