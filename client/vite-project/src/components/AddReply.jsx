import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_REPLY = gql`
  mutation AddReply(
    $content: String!
    $userId: ObjectId!
    $commentId: ObjectId!
    $replyingTo: String
  ) {
    addReply(
      content: $content
      userId: $userId
      commentId: $commentId
      replyingTo: $replyingTo
    ) {
      id
      content
      createdAt
      score
      user {
        id
        username
        imagePngUrl
        imageWebUrl
      }
      replyingTo
      replies {
        id
      }
    }
  }
`;
const GET_COMMENTS = gql`
  query GetComments {
    comments {
      id
      content
      createdAt
      score
      user {
        id
        username
        imagePngUrl
        imageWebUrl
      }
      replies {
        id
        content
        createdAt
        score
        user {
          id
          username
          imagePngUrl
          imageWebUrl
        }
      }
    }
  }
`;

export default function AddReply({ currentUser, commentId, openReplyId }) {
  const [content, setContent] = useState("");
  const [addReply] = useMutation(ADD_REPLY, {
    update(cache, { data: { addReply } }) {
      const { comments } = cache.readQuery({ query: GET_COMMENTS });
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, addReply] }
          : comment
      );
      cache.writeQuery({
        query: GET_COMMENTS,
        data: { comments: updatedComments },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addReply({
        variables: {
          content,
          userId: currentUser.id.toString(),
          commentId,
        },
      });
      console.log("Reply added:", data);
      setContent(""); // Clear the input field after successful submission
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md p-5 ">
      {openReplyId && (
        <div className="flex flex-col h-32 gap-3">
          <textarea
            className="resize-none h-full w-full focus:outline-none border border-lgray focus:border-mblue rounded-md pt-2 pl-5 md:hidden"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a reply..."
            required
          />
          <div className="flex justify-between md:h-full md:items-start">
            <picture>
              <source srcSet={currentUser.imageWebUrl} type="image/webp" />
              <img
                src={currentUser.imagePngUrl}
                alt={currentUser.username}
                className="h-8"
              />
            </picture>
            <textarea
              className="resize-none w-[80%] h-full focus:outline-none border border-lgray focus:border-mblue rounded-md pt-2 pl-5 hidden md:flex"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a reply..."
              required
            />
            {openReplyId && (
              <button
                type="submit"
                className="bg-mblue h-8 px-4 rounded-md text-white text-sm shadow-sm hover:opacity-30"
              >
                REPLY
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
