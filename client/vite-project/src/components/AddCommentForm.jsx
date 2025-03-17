import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";


const AddCommentForm = ({
  username,
  imagePngUrl,
  imageWebUrl,
  scrollToTop,
}) => {
  const [formData, setFormData] = useState({
    content: "",
    userId: "0010101",
    created_at: new Date(),
    score: 0,
  });
  const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server/api/comments/create.php";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/comments/create.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setFormData({ content: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex w-full min-h-[210px] h-[210px] justify-center p-3 ">
      <form
        onSubmit={handleSubmit}
        className=" shadow-md bg-white w-[800px] flex gap-3 flex-col justify-around rounded-md px-5 py-4 md:flex-row"
      >
        <picture className="w-12 hidden md:block">
          <source srcSet={imageWebUrl} type="image/webp" />
          <img src={imagePngUrl} alt={username} className="h-8 w-8" />
        </picture>
        <textarea
          className="w-full border h-[120px] border-lgray focus:border-mblue resize-none rounded-md pl-5 pt-2 focus:outline-none md:h-full"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Add a comment..."
          required
        />
        <button
          className="bg-mblue py-3 px-8 font-bold rounded-md text-white text-sm shadow-sm hover:opacity-30 h-10 hidden md:block"
          type="submit"
          onClick={scrollToTop}
        >
          SEND
        </button>
        <div className="flex justify-between items-center md:hidden">
          <picture>
            <source srcSet={imageWebUrl} type="image/webp" />
            <img src={imagePngUrl} alt={username} className="h-8" />
          </picture>
          <button
            className="bg-mblue py-3 px-8 font-bold rounded-md text-white text-sm shadow-sm hover:opacity-30"
            type="submit"
            onClick={scrollToTop}
          >
            SEND
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
};
