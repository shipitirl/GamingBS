// src/utils/commentUtils.js

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
