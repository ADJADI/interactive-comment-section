import React, { useState, useEffect } from "react";
import topLogo from "../assets/images/icon/icons8-top-48.png";
import axios from "axios";
import Comment from "./Comment";
import PropTypes from "prop-types";
import AddCommentForm from "./AddCommentForm";
import AddReply from "./AddReply";
const CommentList = ({ currentUser, topRef, scrollToTop }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReplyId, setOpenReplyId] = useState(null);

  const toggleReply = (commentId) => {
    setOpenReplyId(openReplyId === commentId ? null : commentId);
  };
  const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/comments/read.php`, {
          withCredentials: true
        });

        if (response.data.success) {
          setComments(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch comments');
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('An error occurred while fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="flex justify-center px-3 py-2  w-full min-h-[400px] h-full  md:py-10">
      <button
        onClick={scrollToTop}
        className="absolute shadow-xl drop-shadow-xl rounded-full bg-mblue bottom-52 right-5 hover:opacity-20 z-50 md:hidden"
      >
        <img src={topLogo} alt="up_arrow" className="" />
      </button>
      <div className="flex flex-col overflow-y-scroll overflow-x-hidden no-scrollbar w-[800px]">
        {comments.toReversed().map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
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

CommentList.propTypes = {
  currentUser: PropTypes.object,
  topRef: PropTypes.object,
  scrollToTop: PropTypes.func,
};


