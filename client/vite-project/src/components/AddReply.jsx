import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReplyApi } from '../hooks/useReplyApi';
import PropTypes from "prop-types";
import defaultUserImage from "../assets/images/avatars/user.png";
export default function AddReply({ commentId, currentUser }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { addReply } = useReplyApi();


  const replyMutation = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    replyMutation.mutate({
      content,
      userId: currentUser.id,
      parentCommentId: commentId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md p-5">
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
              src={currentUser.imagePngUrl.length === 0 ? defaultUserImage : currentUser.imagePngUrl}
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
          <button
            type="submit"
            className="bg-mblue h-8 px-4 rounded-md text-white text-sm shadow-sm hover:opacity-30"
            disabled={replyMutation.isPending}
          >
            {replyMutation.isPending ? 'SENDING...' : 'REPLY'}
          </button>
        </div>
      </div>
    </form>
  );
}

AddReply.propTypes = {
  commentId: PropTypes.string,
  currentUser: PropTypes.object,
};


