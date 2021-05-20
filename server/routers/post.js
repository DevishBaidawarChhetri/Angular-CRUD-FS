const express = require("express");
var multer = require("multer");

const router = express.Router();
const PostProvider = require("../models/postSchema");

// File Mime type
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// Storage for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "../server/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "_" + Date.now() + "." + ext);
  },
});

/**
 * @route POST /api/posts
 * @desc Post posts
 * @access Public (For Now)
 */

router.post(
  "/api/posts",
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content, imagePath } = req.body;
    if (!title || !content) {
      return res.status(422).json({ error: "Don't leave fields empty." });
    }
    try {
      const post = new PostProvider({
        title,
        content,
        imagePath: url + "/images/" + req.file.filename,
      });
      await post.save().then((createdPost) => {
        res.status(201).json({
          message: "Post added successfully.",
          post: {
            ...createdPost,
            _id: createdPost._id,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Server error!" });
    }
  }
);

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

router.put(
  "/api/posts/:id",
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const post = new PostProvider({
        _id: id,
        title,
        content,
        imagePath: imagePath,
      });
      await PostProvider.findByIdAndUpdate(id, post);
      res.status(200).json({ message: "Post Updated successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Server error!" });
    }
  }
);

module.exports = router;
