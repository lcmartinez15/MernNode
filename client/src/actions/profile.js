import axios from "axios";

import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDTAE_PROFILE } from "./types";

// get currrent users profile

export const getCurrentProfile = () => async(dispatch) => {
    try {
        const res = await axios.get("/api/profile/me");
        console.log("current profile" + res);
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
        console.log("create profile");
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