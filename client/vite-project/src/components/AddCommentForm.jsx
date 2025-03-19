import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import PropTypes from "prop-types";
import defaultUserImage from "../assets/images/avatars/user.png";

const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

const AddCommentForm = ({
  username,
  imagePngUrl,
  imageWebUrl,
  scrollToTop,
  userId,
}) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await axios.post(
        `${API_URL}/api/comments/create.php`,
        newComment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setContent("");
      scrollToTop();
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    addCommentMutation.mutate({
      content,
      user_id: userId,
      score: 0,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  };

  return (
    <div className="flex min-h-[13.125rem] shrink-0 justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="shadow-md bg-white w-[50rem] flex gap-3 flex-col justify-around rounded-md px-5 py-4 md:flex-row"
      >
        <picture className="w-12 hidden md:block">
          <source srcSet={imageWebUrl} type="image/webp" />
          <img src={imagePngUrl.length === 0 ? defaultUserImage : imagePngUrl} alt={username} className="h-8 w-8" />
        </picture>
        <textarea
          className="w-full border h-[7.5rem] border-lgray focus:border-mblue resize-none rounded-md pl-5 pt-2 focus:outline-none md:h-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button
          className="bg-mblue py-3 px-8  font-bold rounded-md text-white text-sm shadow-sm hover:opacity-30 h-10 hidden
           md:flex items-center "
          type="submit"
          disabled={addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? 'SENDING...' : 'SEND'}
        </button>
        <div className="flex justify-between items-center md:hidden">
          <picture>
            <source srcSet={imageWebUrl} type="image/webp" />
            <img src={imagePngUrl || "/images/default-avatar.png"} alt={username} className="h-8" />
          </picture>
          <button
            className="bg-mblue py-3 px-8 flex items-center font-bold rounded-md text-white text-sm shadow-sm hover:opacity-30"
            type="submit"
            disabled={addCommentMutation.isPending}
          >
            {addCommentMutation.isPending ? 'SENDING...' : 'SEND'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;

AddCommentForm.propTypes = {
  username: PropTypes.string,
  imagePngUrl: PropTypes.string,
  imageWebUrl: PropTypes.string,
  scrollToTop: PropTypes.func,
  userId: PropTypes.string,
};
