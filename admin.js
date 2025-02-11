async function loadArticles() {
    const response = await fetch("http://localhost:5000/articles");
    const articles = await response.json();

    articlesList.innerHTML = articles.map(article => `
        <div>
            <img src="${article.imageUrl}" width="80">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <button onclick="editArticle('${article._id}')">Edit</button>
            <button onclick="deleteArticle('${article._id}')">Delete</button>
        </div>
    `).join("");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const response = await fetch("http://localhost:5000/articles", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        alert("Article added!");
        form.reset();
        loadArticles();
    }
});

async function deleteArticle(id) {
    await fetch(`http://localhost:5000/articles/${id}`, { method: "DELETE" });
    loadArticles();
}

loadArticles();
