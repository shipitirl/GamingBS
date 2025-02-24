// src/utils/rankingsUtils.js

export async function fetchWriterRankings() {
    const response = await fetch("https://your-backend-url.onrender.com/writer-rankings");
    return response.json();
}
