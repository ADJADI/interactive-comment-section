import axios from 'axios';

const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

export const useCommentsApi = () => {
    const fetchComments = async () => {
        const response = await axios.get(`${API_URL}/api/comments/read.php`);
        return response.data.data;
    };

    const updateCommentScore = async ({ commentId, userId, score }) => {
        const response = await axios.post(`${API_URL}/api/comments/update.php`, {
            commentId,
            userId,
            score
        });
        return response.data;
    };

    const updateCommentContent = async ({ commentId, content }) => {
        const response = await axios.post(`${API_URL}/api/comments/update.php`, {
            commentId,
            content
        });
        return response.data;
    };

    const deleteComment = async (commentId) => {
        const response = await axios.post(`${API_URL}/api/comments/delete.php`, {
            commentId
        });
        return response.data;
    };

    const addReply = async ({ content, userId, parentCommentId }) => {
        const response = await axios.post(`${API_URL}/api/replies/create.php`, {
            content,
            user_id: userId,
            parent_comment_id: parentCommentId
        });
        return response.data;
    };


    return {
        fetchComments,
        updateCommentScore,
        updateCommentContent,
        deleteComment,
        addReply
    };
};
