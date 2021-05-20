const express = require("express");
const router = express.Router();

const PostProvider = require("../models/postSchema");

/**
 * @route POST /api/posts
 * @desc Post posts
 * @access Public (For Now)
 */

router.post("/api/posts", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(422).json({ error: "Don't leave fields empty." });
  }
  try {
    const post = new PostProvider({
      title,
      content,
    });
    await post.save().then((createdPost) => {
      res
        .status(201)
        .json({ message: "Post added successfully.", postId: createdPost._id });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Public (For Now)
 */

router.get("/api/posts", async (req, res) => {
  try {
    const posts = await PostProvider.find({});
    res.status(200).json({ message: "Fetched successfully!", posts: posts });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route GET /api/posts/:id
 * @desc Get individual post
 * @access Public (For now)
 */
router.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostProvider.findById(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route DELETE /api/posts/:id
 * @desc Delete single post
 * @access Public (For Now)
 */

router.delete("/api/posts/:id", async (req, res) => {
  try {
    await PostProvider.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route UPDATE /api/posts/:id
 * @desc Update single post
 * @access Public (For Now)
 */

router.put("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PostProvider.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Post Updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
