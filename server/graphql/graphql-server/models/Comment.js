const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  replyingTo: {
    type: String,
    default: null,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  upvoters: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvoters: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

commentSchema.virtual("responses", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
