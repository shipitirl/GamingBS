// src/utils/articleUtils.js

export async function fetchArticles() {
    const response = await fetch("https://your-backend-url.onrender.com/articles");
    return response.json();
}

export async function upvoteArticle(articleId) {
    const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/upvote`, {
        method: "POST",
    });

    const data = await response.json();
    if (data.error) {
        alert(data.error);
    }
    return data;
}
