// script.js

document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.querySelector(".top-stories .grid");

    let articles = JSON.parse(localStorage.getItem("articles")) || [];

    if (articles.length > 0) {
        newsContainer.innerHTML = articles.map(article => `
            <div class="story-card">
                <img src="${article.imageUrl}" alt="${article.title}">
                <p class="story-text">${article.title}</p>
            </div>
        `).join("");
    }
});


// Load news dynamically
function loadNews() {
    const newsContainer = document.querySelector(".latest-news");
    const articles = [
        { title: "New Zelda Game Announced", img: "https://placehold.co/200x120" },
        { title: "GTA 6 Release Date Leaked", img: "https://placehold.co/200x120" },
        { title: "Elden Ring DLC Coming Soon", img: "https://placehold.co/200x120" }
    ];

    const grid = document.createElement("div");
    grid.classList.add("grid");
    
    articles.forEach(article => {
        const storyCard = document.createElement("div");
        storyCard.classList.add("story-card");
        
        storyCard.innerHTML = `
            <img src="${article.img}" alt="${article.title}">
            <p class="story-text">${article.title}</p>
        `;
        grid.appendChild(storyCard);
    });

    newsContainer.appendChild(grid);
}

// Search functionality
function setupSearch() {
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "Search News...");
    searchInput.style.width = "100%";
    searchInput.style.padding = "10px";
    
    const newsContainer = document.querySelector(".latest-news");
    newsContainer.prepend(searchInput);
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll(".story-text").forEach(story => {
            const parent = story.parentElement;
            if (story.textContent.toLowerCase().includes(query)) {
                parent.style.display = "block";
            } else {
                parent.style.display = "none";
            }
        });
    });
}
