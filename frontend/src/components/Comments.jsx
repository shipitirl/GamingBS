import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export async function fetchComments(articleId) {
    try {
        const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        return response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function postComment(articleId, text) {
    try {
        const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("Failed to post comment");
        return response.json();
    } catch (error) {
        console.error("Error posting comment:", error);
        return null;
    }
}

function Comments({ articleId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments(articleId).then(setComments);
    }, [articleId]);

    const handleCommentSubmit = async () => {
        if (newComment.trim() === "") return;

        const newCommentData = await postComment(articleId, newComment);
        if (newCommentData) {
            setComments([...comments, newCommentData]); // Append new comment instead of refetching all
            setNewComment("");
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <p><strong>{comment.user}:</strong> {comment.text}</p>
                        <p>Upvotes: {comment.upvotes}</p>
                    </div>
                ))}
            </div>
            <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write a comment..."
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
        </div>
    );
}

Comments.propTypes = {
    articleId: PropTypes.string.isRequired, // Ensure articleId is a string
};

export default Comments;
