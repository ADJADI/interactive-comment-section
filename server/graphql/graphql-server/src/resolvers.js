const User = require("../models/User");
const Comment = require("../models/Comment");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const mongoose = require("mongoose");

const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "MongoDB ObjectId scalar type",
  parseValue(value) {
    return new mongoose.Types.ObjectId(value);
  },
  serialize(value) {
    return value.toString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new mongoose.Types.ObjectId(ast.value);
    }
    return null;
  },
});
const populateRepliesRecursively = async (commentId) => {
  const comment = await Comment.findById(commentId)
    .populate("user")
    .populate({
      path: "replies",
      populate: {
        path: "user",
      },
    });

  if (!comment) {
    throw new Error(`Comment with id ${commentId} not found`);
  }

  if (comment.replies && comment.replies.length > 0) {
    comment.replies = await Promise.all(
      comment.replies.map(async (reply) => {
        return await populateRepliesRecursively(reply._id);
      })
    );
  }

  return comment;
};

const resolvers = {
  ObjectId: ObjectIdScalar,

  Query: {
    users: async () => {
      return await User.find();
    },
    comments: async () => {
      const rootComments = await Comment.find({ parentId: null })
        .populate("user")
        .lean();
      const populatedComments = await Promise.all(
        rootComments.map(async (comment) => {
          return await populateRepliesRecursively(comment._id);
        })
      );
      return populatedComments;
    },
  },
  Mutation: {
    addUser: async (_, { username, imagePngUrl, imageWebUrl }) => {
      const user = new User({ username, imagePngUrl, imageWebUrl });
      await user.save();
      return user;
    },
    addComment: async (_, { content, userId }) => {
      const comment = new Comment({
        content,
        user: userId,
        replies: [],
        upvoters: [],
        downvoters: [],
      });
      await comment.save();
      return comment.populate("user");
    },
    updateCommentScore: async (_, { commentId, userId, isUpvote }) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      const hasUpvoted = comment.upvoters.includes(userId);
      const hasDownvoted = comment.downvoters.includes(userId);

      if (isUpvote) {
        if (hasUpvoted) {
          throw new Error("You have already upvoted!");
        } else {
          if (hasDownvoted) {
            comment.downvoters.pull(userId);
            comment.score += 1;
          } else {
            comment.upvoters.push(userId);
            comment.score += 1;
          }
        }
      } else {
        if (hasDownvoted) {
          throw new Error("You have already downvoted!");
        } else {
          if (hasUpvoted) {
            comment.upvoters.pull(userId);
            comment.score -= 1;
          } else {
            comment.downvoters.push(userId);
            comment.score -= 1;
          }
        }
      }

      await comment.save();
      return Comment.findById(commentId).populate("user replies");
    },
    addReply: async (_, { content, userId, commentId, replyingTo }) => {
      const reply = new Comment({
        content,
        user: userId,
        parentId: commentId,
        replyingTo,
        replies: [], // Initialize replies as an empty array
        upvoters: [],
        downvoters: [],
      });
      await reply.save();

      const parentComment = await Comment.findById(commentId);
      parentComment.replies.push(reply._id);
      await parentComment.save();

      return reply.populate("user");
    },
    deleteComment: async (_, { commentId }) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      await Comment.findByIdAndDelete(commentId);

      return true; // Return true if the deletion was successful
    },
    editComment: async (_, { commentId, userId, content }) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      // Check if the user is the owner of the comment
      if (comment.user.toString() !== userId) {
        throw new Error("You do not have permission to edit this comment");
      }

      // Update the comment's content
      comment.content = content;
      await comment.save();

      return comment; // Return the updated comment
    },
  },
};

module.exports = resolvers;
