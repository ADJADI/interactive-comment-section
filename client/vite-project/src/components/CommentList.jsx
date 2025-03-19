import { useQuery } from '@tanstack/react-query';
import { useCommentsApi } from '../hooks/useCommentApi';
import Comment from './Comment';
import PropTypes from "prop-types";
import { useReplyApi } from '../hooks/useReplyApi';
const CommentList = ({ currentUser, topRef, scrollToTop }) => {
  const { fetchComments } = useCommentsApi();
  const { fetchReplies } = useReplyApi();

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchComments
  });

  const { data: replies } = useQuery({
    queryKey: ['replies'],
    queryFn: fetchReplies
  });
  if (isLoading) return <div className="text-center p-4">Loading comments...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading comments: {error.message}</div>;

  return (
    <>
      <button
        onClick={scrollToTop}
        className="absolute shadow-xl drop-shadow-xl rounded-full bg-mblue bottom-52 right-5 hover:opacity-20 z-50 md:hidden"
      >
        <img src="/images/icon/icons8-top-48.png" alt="up_arrow" />
      </button>
      <div className="flex flex-col self-center overflow-y-scroll overflow-x-hidden no-scrollbar w-[800px]">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="transition-all duration-300">
              <Comment
                comment={comment}
                currentUser={currentUser}
                topRef={topRef}
                replies={replies}
              />
            </div>
          ))
        ) : (
          <div className="text-center p-4">No comments yet</div>
        )}
      </div>
    </>
  );
};

export default CommentList;

CommentList.propTypes = {
  currentUser: PropTypes.object,
  topRef: PropTypes.object,
  scrollToTop: PropTypes.func,
};


