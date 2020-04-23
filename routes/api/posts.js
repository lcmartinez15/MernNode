const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route GET api/posts
// @desc  Get all posts route
// @access Public
router.get("/", auth, async(req, res) => {
    console.log("get posts");
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

// @route POST api/posts
// @desc  Create posts
// @access Public
router.post(
    "/", [auth, [check("text", "text is required").not().isEmpty()]],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select("-password");
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            const post = await newPost.save();

            res.json(post);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("server error");
        }
    }
);

// @route GET api/posts/:id
// @desc  Get post by id
// @access Public
router.get("/:id", auth, async(req, res) => {
    console.log("get posts by id");
    try {
        const posts = await Post.findById(req.params.id);

        if (!posts)
            return res.status(400).json({ msg: "there is no post for this user" });

        res.json(posts);
    } catch (error) {
        console.log(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: "there is no post for this user" });
        }
        res.status(500).send("server error");
    }
});

// @route DELETE api/post
// @desc  Post profile user & post
// @access Private

router.delete("/:id", auth, async(req, res) => {
    try {
        //@todo - remove user post
        console.log("delete profile by use id -" + req.user.id);
        const post = await Post.findById(req.params.id);

        if (post.user.toString() !== req.user.id) {
            return res.status(400).json({ msg: "not authorize" });
        }

        await post.remove();

        res.json({ msg: "user delete" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
});

router.put("/like/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id).len !==
            req.user.id
        ) {
            return res.status(400).json({ msg: "not authorize" });
        }

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).json("server error");
    }
});

module.exports = router;