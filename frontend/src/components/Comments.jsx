import { useEffect, useState } from "react";

export async function fetchComments(articleId) {
    const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/comments`);
    return response.json();
}

export async function postComment(articleId, text) {
    const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return response.json();
}

function Comments({ articleId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments(articleId).then(setComments);
    }, [articleId]);

    const handleCommentSubmit = async () => {
        if (newComment.trim() === "") return;
        await postComment(articleId, newComment);
        setNewComment("");
        fetchComments(articleId).then(setComments);
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
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..."></textarea>
            <button onClick={handleCommentSubmit}>Post Comment</button>
        </div>
    );
}

export default Comments;
