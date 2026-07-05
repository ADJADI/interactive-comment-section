const { gql } = require("apollo-server-express");

// Note : le résolveur du scalaire ObjectId (parseValue/serialize/parseLiteral)
// est défini une seule fois, dans resolvers.js, et branché ici via `scalar ObjectId`.
const typeDefs = gql`
  scalar ObjectId

  type User {
    id: ObjectId!
    username: String!
    imagePngUrl: String!
    imageWebUrl: String!
  }

  type Comment {
    id: ObjectId!
    content: String!
    createdAt: String!
    score: Int!
    user: User!
    replyingTo: String
    replies: [Comment]
    upvoters: [ObjectId!]!
    downvoters: [ObjectId!]!
  }

  type Query {
    users: [User]
    comments: [Comment]
  }

  type Mutation {
    addUser(username: String!, imagePngUrl: String!, imageWebUrl: String!): User
    addComment(content: String!, userId: ObjectId!): Comment
    updateCommentScore(
      commentId: ObjectId!
      userId: ObjectId!
      isUpvote: Boolean!
    ): Comment
    addReply(
      content: String!
      userId: ObjectId!
      commentId: ObjectId!
      replyingTo: String
    ): Comment
    deleteComment(commentId: ID!, userId: ID!): Boolean
    editComment(commentId: ID!, userId: ID!, content: String!): Comment
  }
`;

module.exports = typeDefs;
