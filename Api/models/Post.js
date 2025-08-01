const mongooses = require("mongoose");

const postSchema = new mongooses.Schema(
  {
    user: {
      type: mongooses.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    prompt: {
      type: String,
      trim: true,
    },
    negativePrompt: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      trim: true,
    },
    quentity: {
      type: Number,
      trim: true,
    },
    style: {
      type: String,
      trim: true,
    },
    aiModel: {
      type: String,
      trim: true,
    },
    aiMage: [
      {
        type: String,
        require: false,
      },
    ],
    images: [
      {
        type: String,
        require: false,
      },
    ],
    likes: [
      {
        type: mongooses.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timeseries: true,
  }
);

const Post = mongooses.model("Post", postSchema);

module.exports = Post;
