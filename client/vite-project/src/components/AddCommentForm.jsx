import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation AddComment($content: String!, $userId: ObjectId!) {
    addComment(content: $content, userId: $userId) {
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
      }
    }
  }
`;

const COMMENTS_QUERY = gql`
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

const AddCommentForm = ({
  username,
  imagePngUrl,
  imageWebUrl,
  userId,
  scrollToTop,
}) => {
  const [content, setContent] = useState("");
  const [addComment] = useMutation(ADD_COMMENT, {
    update(cache, { data: { addComment } }) {
      const { comments } = cache.readQuery({ query: COMMENTS_QUERY });
      cache.writeQuery({
        query: COMMENTS_QUERY,
        data: { comments: [...comments, addComment] },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({
        variables: {
          content,
          userId: userId.toString(),
        },
      });
      setContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex w-full min-h-[210px] h-[210px] justify-center p-3 ">
      <form
        onSubmit={handleSubmit}
        className=" shadow-md  bg-white w-[800px] flex gap-3 flex-col   justify-around rounded-md px-5 py-4 md:flex-row"
      >
        <picture className="w-12 hidden md:block">
          <source srcSet={imageWebUrl} type="image/webp" />
          <img src={imagePngUrl} alt={username} className="h-8 w-8" />
        </picture>
        <textarea
          className="w-full border h-[120px] border-lgray focus:border-mblue resize-none rounded-md pl-5 pt-2 focus:outline-none md:h-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
