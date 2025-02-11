import { useEffect, useState } from "react";

export async function fetchTopComments() {
    const response = await fetch("https://your-backend-url.onrender.com/comments/top");
    return response.json();
}

function TopComments() {
    const [topComments, setTopComments] = useState([]);

    useEffect(() => {
        fetchTopComments().then(setTopComments);
    }, []);

    return (
        <div className="top-comments-section">
            <h3>Top Comments of the Day</h3>
            <ul>
                {topComments.map(comment => (
                    <li key={comment._id}>
                        <p><strong>{comment.user}:</strong> {comment.text}</p>
                        <p>Upvotes: {comment.upvotes}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopComments;
