const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const config = require("config");
const request = require("request");

// @route GET api/profile/me
// @desc  get current users profile
// @access Public

router.get("/me", auth, async(req, res) => {
    try {
        console.log("start get profile" + req.user.name);
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populated("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route POST api/profile
// @desc  Create or Update profile
// @access Private

router.post(
    "/", [
        auth, [
            check("status", "Status is required").not().isEmpty(),
            check("skills", "skills is required").not().isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin,
        } = req.body;
        // build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(",").map((skills) => skills.trim());
        }

        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        console.log(skills);

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                return res.json(profile);
            }

            //Create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("server error");
        }
        res.send("hello");
    }
);

// @route GET api/profile
// @desc  Get all profiles
// @access Public

router.get("/", async(req, res) => {
    console.log("get profiles");
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user id
// @access Public

router.get("/user/:user_id", async(req, res) => {
    try {
        console.log("get profile by use id");
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);

        if (!profile)
            return res.status(400).json({ msg: "there is no profile for this user" });

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route DELETE api/profile
// @desc  Delete profile user & post
// @access Private

router.delete("/", auth, async(req, res) => {
    try {
        //@todo - remove user post
        console.log("delete profile by use id -" + req.user.id);

        //Remove profile
        await Profile.findOneAndRemove({
            user: mongoose.Types.ObjectId(req.user.id),
        });

        await User.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.user.id) });

        res.json({ msg: "user delete" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route PUT api/profile/experience
// @desc  Add profile experience
// @access Private
router.put(
    "/experience", [
        auth, [
            check("title", "Title is required").not().isEmpty(),
            check("company", "skills is required").not().isEmpty(),
            check("from", "skills is required").not().isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).json("server error");
        }
    }
);

// @route DELETE api/profile/experience
// @desc  Add profile experience
// @access Private
router.delete("/experience/:exp_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeindex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeindex, 1);

        await profile.save();

        res.json(profile);
        //@todo - remove user post
        console.log("delete experience by  id -" + req.user.id);

        //Remove profile
        await Profile.findOneAndRemove({
            user: mongoose.Types.ObjectId(req.user.id),
        });

        await User.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.user.id) });

        res.json({ msg: "user delete" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route PUT api/profile/education
// @desc  Add profile education
// @access Private
router.put(
    "/education", [
        auth, [
            check("school", "school is required").not().isEmpty(),
            check("degree", "degree is required").not().isEmpty(),
            check("from", "skills is required").not().isEmpty(),
        ],
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldostudy,
            from,
            to,
            current,
            description,
        } = req.body;
        const newED = {
            school,
            degree,
            fieldostudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newED);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error.message);
            res.status(500).json("server error");
        }
    }
);

// @route DELETE api/profile/education
// @desc  Add profile education
// @access Private
router.delete("/education/:edu_id", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeindex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeindex, 1);

        await profile.save();

        res.json(profile);
        //@todo - remove user post
        console.log("delete education by  id -" + req.user.id);

        //Remove profile
        await Profile.findOneAndRemove({
            user: mongoose.Types.ObjectId(req.user.id),
        });

        await User.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.user.id) });

        res.json({ msg: "user delete" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route GET api/profile/github/:username
// @desc  get  profile github
// @access Private

router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=create:asc&client_id=${config.get(
        "githubclientId"
      )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node.js" },
        };

        console.log(options);
        request(options, (error, response, body) => {
            if (error) console.log(error);

            if (response.statusCoe !== 200) {
                return res
                    .status(400)
                    .json({ msg: "no github profile found" + request });
            }

            res.json(body);
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

module.exports = router;