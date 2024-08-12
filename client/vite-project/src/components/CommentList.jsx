import React, { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import topLogo from "../assets/images/icon/icons8-top-48.png";

import { useQuery, gql, useMutation } from "@apollo/client";
import Comment from "./Comment";

const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
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
    upvoters
    downvoters
  }
`;

const GET_COMMENTS = gql`
  query GetComments {
    comments {
      ...CommentFragment
      replies {
        ...CommentFragment
        replies {
          ...CommentFragment
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

const UPDATE_COMMENT_SCORE = gql`
  mutation UpdateCommentScore(
    $commentId: ObjectId!
    $userId: ObjectId!
    $isUpvote: Boolean!
  ) {
    updateCommentScore(
      commentId: $commentId
      userId: $userId
      isUpvote: $isUpvote
    ) {
      id
      score
    }
  }
`;

const CommentList = ({ currentUser, topRef, scrollToTop }) => {
  const [isReplyClicked, setIsReplyClicked] = useState(false);
  const { loading, error, data } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
  });
  const [updateCommentScore] = useMutation(UPDATE_COMMENT_SCORE);
  const [openReplyId, setOpenReplyId] = useState(null);
  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

  const handleReplyClick = () => {
    setIsReplyClicked(!isReplyClicked);
  };
  const toggleReply = (commentId) => {
    setOpenReplyId(openReplyId === commentId ? null : commentId);
  };

  return (
    <div className="flex justify-center px-3 py-2  w-full min-h-[400px] h-full  md:py-10">
      <button
        onClick={scrollToTop}
        className="absolute shadow-xl drop-shadow-xl rounded-full bg-mblue bottom-52 right-5 hover:opacity-20 z-50 md:hidden"
      >
        <img src={topLogo} alt="up_arrow" className="" />
      </button>
      <div className="flex flex-col overflow-y-scroll overflow-x-hidden no-scrollbar w-[800px]">
        {data.comments.toReversed().map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            updateCommentScore={updateCommentScore}
            openReplyId={openReplyId}
            toggleReply={toggleReply}
            topRef={topRef}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
