import { useState } from "react";
import axios from "axios";

export default function AddReply({ currentUser, commentId, openReplyId }) {
  const [content, setContent] = useState("");
  const [setFormReply, setSetFormReply] = useState(
    {
      content: "",
      userId: currentUser,
      commentId,
      replyingTo: "",
      score: 0,
    }
  );
  const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/api/inscription/inscription.php`,
        setFormReply,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      setContent("");
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
