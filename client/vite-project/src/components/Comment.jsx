import React, { useState, useRef } from "react";
import deleteLogo from "../assets/images/icon/icon-delete.svg";
import editLogo from "../assets/images/icon/icon-edit.svg";
import replyLogo from "../assets/images/icon/icon-reply.svg";
import AddReply from "./AddReply";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;
export const EDIT_COMMENT = gql`
  mutation EditComment($commentId: ID!, $userId: ID!, $content: String!) {
    editComment(commentId: $commentId, userId: $userId, content: $content) {
      id
      content
    }
  }
`;

const Comment = ({
  comment,
  currentUser,
  updateCommentScore,
  openReplyId,
  toggleReply,
  topRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [openDelete, setOpenDelete] = useState(false);
  const [editComment] = useMutation(EDIT_COMMENT, {
    update(cache, { data: { editComment } }) {
      cache.modify({
        id: cache.identify(comment),
        fields: {
          content() {
            return editComment.content;
          },
        },
      });
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update(cache, { data: { deleteComment } }) {
      if (deleteComment) {
        cache.modify({
          fields: {
            comments(existingComments = [], { readField }) {
              return existingComments.filter(
                (commentRef) => comment.id !== readField("id", commentRef)
              );
            },
          },
        });
      }
    },
  });
  const handleUpvote = async () => {
    try {
      await updateCommentScore({
        variables: {
          commentId: comment.id,
          userId: currentUser.id,
          isUpvote: true,
        },
      });
    } catch (error) {
      console.error("Error updating score:", error.message);
    }
  };

  const handleDownvote = async () => {
    try {
      await updateCommentScore({
        variables: {
          commentId: comment.id,
          userId: currentUser.id,
          isUpvote: false,
        },
      });
    } catch (error) {
      console.error("Error updating score:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment({
        variables: {
          commentId: comment.id,
        },
      });
      alert("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const handleEdit = async () => {
    try {
      await editComment({
        variables: {
          commentId: comment.id,
          userId: currentUser.id,
          content: content,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error.message);
    }
  };
  const handleCancel = () => {
    setContent(comment.content);
    setIsEditing(false);
  };
  const toggleDeleteTab = () => {
    setOpenDelete(!openDelete);
  };

  return (
    <div className="flex flex-col  gap-3 md:ml-20 " ref={topRef}>
      <div className="flex flex-col-reverse gap-5 p-5 rounded-lg   bg-white md:flex-row ">
        <div className="hidden bg-vlgray font-bold max-h-20 w-8 items-center rounded-lg px-10 py-1 md:py-0 md:px-0 md:flex-col md:flex">
          <button onClick={handleUpvote} className="text-lgblue">
            +
          </button>
          <span className="text-mblue">{comment.score}</span>
          <button onClick={handleDownvote} className="text-lgblue">
            -
          </button>
        </div>
        <div className="flex items-center justify-between md:hidden">
          <div className="flex bg-lgray font-bold max-h-20 w-8 items-center justify-center gap-3 rounded-lg px-10 py-1 md:py-0 md:px-0 md:flex-col md:hidden ">
            <button onClick={handleUpvote} className="text-lgblue">
              +
            </button>
            <span className="text-mblue">{comment.score}</span>
            <button onClick={handleDownvote} className="text-lgblue">
              -
            </button>
          </div>
          <div className="flex gap-5">
            {comment.user.id === currentUser.id && (
              <button
                className="flex  items-center gap-3 hover:opacity-50"
                onClick={toggleDeleteTab}
              >
                <img src={deleteLogo} alt="delete_logo" />
                <span className="text-sm font-bold text-sred">Delete</span>
              </button>
            )}

            {comment.user.id === currentUser.id ? (
              <div className="">
                {isEditing ? (
                  <button
                    className="text-sm items-center flex gap-1.5 text-mblue font-bold hover:opacity-50"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="text-xs items-center flex gap-1.5 text-mblue font-semibold hover:opacity-50"
                    onClick={() => setIsEditing(true)}
                  >
                    <img src={editLogo} alt="edit_logo" />
                    <span className="font-bold text-sm">Edit</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                className="text-xs items-center flex gap-1.5 text-mblue font-semibold hover:opacity-50"
                onClick={() => toggleReply(comment.id)}
              >
                <img src={replyLogo} alt="reply_logo" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <picture>
                <source
                  srcSet={comment.user.imageWebUrl}
                  type="image/webp"
                  className="h-6"
                />
                <img
                  src={comment.user.imagePngUrl}
                  alt={comment.user.username}
                  className="h-6"
                />
              </picture>

              <span className="text-xs font-bold text-dblue">
                {comment.user.username}
              </span>
              {comment.user.id === currentUser.id && (
                <span className="px-2.5 py-0.5 font-semibold rounded-sm text-xs text-white bg-mblue">
                  you
                </span>
              )}
              <span className="text-xs font-semibold  text-dblue">
                {formatDistanceToNow(new Date(+comment.createdAt))} ago
              </span>
            </div>
            <div className=" gap-5 hidden md:flex">
              {comment.user.id === currentUser.id && (
                <button
                  className="flex  items-center gap-3 hover:opacity-50"
                  onClick={toggleDeleteTab}
                >
                  <img src={deleteLogo} alt="delete_logo" />
                  <span className="text-sm font-bold text-sred">Delete</span>
                </button>
              )}

              {comment.user.id === currentUser.id ? (
                <div className="">
                  {isEditing ? (
                    <button
                      className="text-sm font-bold items-center flex gap-1.5 text-mblue  hover:opacity-50"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="text-xs items-center flex gap-1.5 text-mblue font-semibold hover:opacity-50"
                      onClick={() => setIsEditing(true)}
                    >
                      <img src={editLogo} alt="edit_logo" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="text-xs items-center flex gap-1.5 text-mblue font-semibold hover:opacity-50"
                  onClick={() => toggleReply(comment.id)}
                >
                  <img src={replyLogo} alt="reply_logo" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <textarea
                name="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-sm h-20 p-2 resize-none outline-none rounded-md border-lgray focus:border-mblue border"
              >
                {comment.content}
              </textarea>
            ) : (
              <p className="text-dblue  text-sm">{comment.content}</p>
            )}
            {comment.user.id === currentUser.id && isEditing && (
              <button
                className="bg-mblue font-semibold place-self-end  h-8 w-20 px-4 rounded-md text-white text-sm shadow-sm hover:opacity-30"
                onClick={handleEdit}
              >
                UPDATE
              </button>
            )}
          </div>
        </div>
      </div>
      {openReplyId === comment.id && (
        <AddReply
          commentId={comment.id}
          currentUser={currentUser}
          openReplyId={openReplyId}
        />
      )}

      <div className="flex flex-col pl-3 w-full relative md:ml-0">
        <span className="absolute h-full w-0.5 bg-lgray top-0 -ml-2 md:ml-8"></span>
        {comment.replies &&
          comment.replies
            .toReversed()
            .map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                updateCommentScore={updateCommentScore}
                openReplyId={openReplyId}
                toggleReply={toggleReply}
              />
            ))}
      </div>
      {openDelete && (
        <div className="flex w-full h-full justify-center items-center">
          <div className="absolute z-50 shadow-md rounded-md px-7 py-5 m-5 flex flex-col gap-4  bg-white md:w-[400px] md:left-1/3 md:top-52">
            <h3 className="font-bold text-xl text-dblue">Delete comment</h3>
            <p className="text-glue font-medium">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="flex gap-2">
              <button
                className="text-white z-50 font-semibold rounded-lg w-full text-lg py-3.5 bg-gray-500"
                onClick={toggleDeleteTab}
              >
                NO, CANCEL
              </button>
              <button
                className="text-white z-50 font-semibold w-full rounded-lg  text-lg py-3.5 bg-sred"
                onClick={handleDelete}
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
      {openDelete && (
        <div className="absolute left-0 top-0 w-full h-screen bg-black opacity-50 z-40"></div>
      )}
    </div>
  );
};

export default Comment;
