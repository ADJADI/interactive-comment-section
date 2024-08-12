const { gql } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

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
    deleteComment(commentId: ID!): Boolean
    editComment(commentId: ID!, userId: ID!, content: String!): Comment
  }
`;

module.exports = typeDefs;
