const axios = require("axios");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const Post = require("../models/Post");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const generatedFilename = (userId, allPostLength) => {
  const date = new Date().toDateString().replace(/:/g, "_");
  return `${userId}-${allPostLength}-${date}.png`;
};

const postWithImagesController_V3 = async (req, res, next) => {
  const { userId } = req.params;
  const { prompt, negativePrompt, size, style, imageUrl, revisedPrompt } =
    req.body;

  if (!userId || !imageUrl || !size || !style) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    const allPostLength = await Post.countDocuments();
    const filename = generatedFilename(userId, allPostLength);
    const filePath = path.join(__dirname, "../../", "uploads", filename);

    let response;
    try {
      response = await axios({
        url: imageUrl,
        responseType: "arraybuffer",
        maxRedirects: 5,
      });
    } catch (err) {
      throw new CustomError("Image download failed", 500);
    }

    try {
      const imageBuffer = Buffer.from(response.data);
      await sharp(imageBuffer).png().toFile(filePath);
    } catch (err) {
      throw new CustomError("Image processing failed", 500);
    }

    const newPost = new Post({
      user: userId,
      aiModel: "V3",
      prompt: prompt,
      negativePrompt: negativePrompt,
      revisedPrompt,
      size,
      quality: "HD",
      quentity: 1,
      style,
      images: filename,
      aiMage: imageUrl,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

const generatedFilenameMultiple = (userId, index) => {
  const date = new Date().toDateString().replace(/:/g, "_").replace(/\s/g, "_");
  return `${userId}-${index}-${date}.png`;
};

const postWithImagesController_V2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { prompt, negativePrompt, size, style, imageUrls, revisedPrompt } =
      req.body;

    // ✅ Normalize imageUrls input (string or array)
    let imageUrlsNormalized = [];

    if (typeof imageUrls === "string") {
      imageUrlsNormalized = [imageUrls];
    } else if (Array.isArray(imageUrls)) {
      imageUrlsNormalized = imageUrls;
    } else {
      return res.status(400).json({ message: "Invalid imageUrls format" });
    }

    // ✅ Validate input
    if (!userId || imageUrlsNormalized.length === 0 || !size || !prompt) {
      return res.status(400).json({ message: "Missing or invalid inputs" });
    }

    // ✅ Find the user
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    const savedFilenames = [];

    // ✅ Download and process each image
    await Promise.all(
      imageUrlsNormalized.map(async (imageUrl, index) => {
        const filename = generatedFilenameMultiple(userId, index);
        const filePath = path.join(__dirname, "../../", "uploads", filename);

        let response;
        try {
          response = await axios({
            url: imageUrl,
            responseType: "arraybuffer",
            maxRedirects: 5,
          });
        } catch (err) {
          throw new CustomError(`Image ${index + 1} download failed`, 500);
        }

        try {
          const imageBuffer = Buffer.from(response.data);
          await sharp(imageBuffer).png().toFile(filePath);
          savedFilenames.push(filename);
        } catch (err) {
          throw new CustomError(`Image ${index + 1} processing failed`, 500);
        }
      })
    );

    // ✅ Create new post
    const newPost = new Post({
      user: userId,
      aiModel: "V2",
      prompt,
      negativePrompt: negativePrompt || "Not provided",
      revisedPrompt: "Not available in V2-model",
      size,
      quality: "Normal",
      quentity: imageUrlsNormalized.length,
      style: style || "normal",
      images: savedFilenames,
      aiMage: imageUrlsNormalized,
    });

    await newPost.save();

    // ✅ Add post to user
    user.posts.push(newPost._id);
    await user.save();

    // ✅ Send response
    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

const getPostController = async (req, res, next) => {
  try {
    const allPost = await Post.find().populate("user", "username");
    return res.status(200).json({ posts: allPost });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("user", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserPostController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const posts = await Post.find({ user: userId }); 

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};



const deletePostController = async (req, res, next) => {
  try {
  } catch (error) {}
};

const likePostController = async (req, res, next) => {
  try {
  } catch (error) {}
};
const disLikePostController = async (req, res, next) => {
  try {
  } catch (error) {}
};

module.exports = {
  disLikePostController,
  likePostController,
  deletePostController,
  getPostController,
  getSinglePostController,
  getUserPostController,
  postWithImagesController_V2,
  postWithImagesController_V3,
  generatedFilename,
  generatedFilenameMultiple,
};
