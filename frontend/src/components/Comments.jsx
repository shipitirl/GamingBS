import { useEffect, useState } from "react";
import { fetchComments, postComment } from "../utils/commentUtils";
import PropTypes from "prop-types";

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
            setComments([...comments, newCommentData]);
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
    articleId: PropTypes.string.isRequired,
};

export default Comments;
