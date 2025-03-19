import axios from 'axios';

const API_URL = "http://127.0.0.1/frontEndMentor/interactive-comment-section/server";

export const useReplyApi = () => {
    const fetchReplies = async () => {
        const response = await axios.get(`${API_URL}/api/replies/read.php`);
        return response.data.data;
    };

    const updateReplyScore = async ({ replyId, userId, score }) => {
        const response = await axios.post(`${API_URL}/api/replies/update.php`, {
            replyId,
            userId,
            score
        });
        return response.data;
    };

    const updateReplyContent = async ({ replyId, content }) => {
        const response = await axios.post(`${API_URL}/api/replies/update.php`, {
            replyId,
            content
        });
        return response.data;
    };

    const deleteReply = async (replyId) => {
        const response = await axios.post(`${API_URL}/api/replies/delete.php`, {
            replyId
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
        fetchReplies,
        updateReplyScore,
        updateReplyContent,
        deleteReply,
        addReply
    };
};
