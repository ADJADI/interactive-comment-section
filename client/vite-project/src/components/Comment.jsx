import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCommentsApi } from '../hooks/useCommentApi';
import deleteLogo from "../assets/images/icon/icon-delete.svg";
import editLogo from "../assets/images/icon/icon-edit.svg";
import replyLogo from "../assets/images/icon/icon-reply.svg";
import AddReply from "./AddReply";
import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import axios from "axios";
import defaultUserImage from "../assets/images/avatars/user.png";

const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

const VoteButton = ({ onClick, isActive, disabled, children }) => (
  <button
    onClick={onClick}
    className={`${isActive ? 'text-mblue font-bold' : 'text-lgblue'}`}
    disabled={disabled}
  >
    {children}
  </button>
);

VoteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired
};

const ActionButton = ({ onClick, icon, text, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 hover:opacity-50 ${className}`}
  >
    {icon && <img src={icon} alt={`${text}_logo`} />}
    <span className={className.includes('text-sred') ? 'text-sm font-bold text-sred' : 'text-xs font-semibold text-mblue'}>
      {text}
    </span>
  </button>
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

const DeleteModal = ({ onCancel, handleDelete, isPending }) => (
  <>
    <div className="flex w-full h-full justify-center items-center">
      <div className="absolute z-50 shadow-md rounded-md px-7 py-5 m-5 flex flex-col gap-4 bg-white md:w-[400px] md:left-1/3 md:top-52">
        <h3 className="font-bold text-xl text-dblue">Delete comment</h3>
        <p className="text-glue font-medium">
          Are you sure you want to delete this comment? This will remove the
          comment and can&apos;t be undone.
        </p>
        <div className="flex gap-2">
          <button
            className="text-white z-50 font-semibold rounded-lg w-full text-lg py-3.5 bg-gray-500"
            onClick={onCancel}
          >
            NO, CANCEL
          </button>
          <button
            className="text-white z-50 font-semibold w-full rounded-lg text-lg py-3.5 bg-sred"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'DELETING...' : 'YES, DELETE'}
          </button>
        </div>
      </div>
    </div>

  </>
);

DeleteModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired
};

const Comment = ({ comment, currentUser, topRef, replies }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReplyId, setOpenReplyId] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user', comment.user_id],
    queryFn: () => axios.get(`${API_URL}/api/inscription/inscriptionRead.php?id=${comment.user_id}`)
      .then(res => res.data),
    enabled: !!comment.user_id
  });

  const username = user?.data?.username || "anonymous";
  const userImage = user?.data?.image_png_url || defaultUserImage;
  const isCurrentUser = comment.user_id === +currentUser.id;

  const queryClient = useQueryClient();
  const { updateCommentScore, updateCommentContent, deleteComment } = useCommentsApi();

  const mutations = {
    score: useMutation({
      mutationFn: updateCommentScore,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: ['comments'] });
        const previousComments = queryClient.getQueryData(['comments']);
        queryClient.setQueryData(['comments'], old =>
          old.map(c => c.id === variables.commentId ? { ...c, score: variables.score } : c)
        );
        return { previousComments };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(['comments'], context.previousComments);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
    }),
    content: useMutation({
      mutationFn: updateCommentContent,
      onSuccess: () => {
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    }),
    delete: useMutation({
      mutationFn: deleteComment,
      onSuccess: () => {
        setOpenDelete(false);
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
      onError: (error) => {
        console.error('Error deleting comment:', error);
      }
    }),
  };

  const [voteState, setVoteState] = useState(0);

  const handleUpvote = () => {
    if (voteState === 0) {
      mutations.score.mutate({
        commentId: comment.id,
        userId: currentUser.id,
        score: comment.score + 1
      });
      setVoteState(1);
    } else if (voteState === -1) {
      mutations.score.mutate({
        commentId: comment.id,
        userId: currentUser.id,
        score: comment.score + 1
      });
      setVoteState(0);
    }
  }

  const handleDownvote = () => {
    if (voteState === 0) {
      mutations.score.mutate({
        commentId: comment.id,
        userId: currentUser.id,
        score: comment.score - 1
      });
      setVoteState(-1);
    } else if (voteState === 1) {
      mutations.score.mutate({
        commentId: comment.id,
        userId: currentUser.id,
        score: comment.score - 1
      });
      setVoteState(0);
    }
  }

  const handleUpdate = () => {
    if (content.trim()) {
      mutations.content.mutate({
        commentId: comment.id,
        content: content
      });
    }
  };

  const handleCancel = () => {
    setContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    mutations.delete.mutate(comment.id);
  };

  const toggleDeleteTab = () => setOpenDelete(!openDelete);
  const toggleReply = (commentId) => setOpenReplyId(openReplyId === commentId ? null : commentId);

  const commentReplies = replies?.filter(reply => reply.parent_comment_id === comment.id) || [];

  return (
    <div className="flex flex-col pb-5 gap-3 md:pl-20 ">
      <div className="flex p-5 bg-white rounded-lg items-center justify-between">
        <div className="bg-vlgray font-bold max-h-20 w-8 items-center rounded-lg px-10 py-1 md:py-0 md:px-0 md:flex-col md:flex">
          <VoteButton onClick={handleUpvote} isActive={voteState === 1}>+</VoteButton>
          <span className="text-mblue">{comment.score}</span>
          <VoteButton onClick={handleDownvote} isActive={voteState === -1} disabled={comment.score <= 0}>-</VoteButton>
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={userImage} alt={username} className="h-6" />
              <span className="text-xs font-bold text-dblue">{username}</span>
              {isCurrentUser && (
                <span className="px-2.5 py-0.5 font-semibold rounded-sm text-xs text-white bg-mblue">you</span>
              )}
              <span className="text-xs font-semibold text-dblue">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at)) + " ago" : "recently"}
              </span>
            </div>

            <div className="gap-5 flex">
              {isCurrentUser ? (
                <>
                  <ActionButton onClick={toggleDeleteTab} icon={deleteLogo} text="Delete" className="text-sred" />
                  {isEditing ? (
                    <ActionButton onClick={handleCancel} text="Cancel" />
                  ) : (
                    <ActionButton onClick={() => setIsEditing(true)} icon={editLogo} text="Edit" />
                  )}
                </>
              ) : (
                <ActionButton onClick={() => toggleReply(comment.id)} icon={replyLogo} text="Reply" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <textarea
                  name="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm h-20 p-2 resize-none outline-none rounded-md border-lgray focus:border-mblue border"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-mblue text-white px-4 py-2 rounded-md text-sm font-bold"
                    onClick={handleUpdate}
                    disabled={mutations.content.isPending || !content.trim()}
                  >
                    {mutations.content.isPending ? 'UPDATING...' : 'UPDATE'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-dblue text-sm">{comment.content}</p>
            )}
          </div>
        </div>
      </div>

      {openReplyId === comment.id && (
        <AddReply commentId={comment.id} currentUser={currentUser} />
      )}

      {commentReplies.length > 0 && (
        <div className="flex flex-col w-full relative md:ml-0">
          <span className="absolute h-full w-0.5 bg-lgray top-0 md:ml-8"></span>
          {commentReplies.toReversed().map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              topRef={topRef}
              replies={replies}
            />
          ))}
        </div>
      )}
      {openDelete && (
        <div className="fixed left-0 top-0 w-full h-screen bg-black bg-opacity-50 z-40">
          <DeleteModal
            onCancel={toggleDeleteTab}
            handleDelete={handleDelete}
            isPending={mutations.delete.isPending}
          />
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  topRef: PropTypes.object,
  replies: PropTypes.array,
};

export default Comment;
