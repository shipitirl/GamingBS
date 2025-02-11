import { useEffect, useState } from "react";

export async function fetchTopWriters() {
    const response = await fetch("https://your-backend-url.onrender.com/writers/rankings");
    return response.json();
}

function WriterRankings() {
    const [writers, setWriters] = useState([]);

    useEffect(() => {
        fetchTopWriters().then(setWriters);
    }, []);

    return (
        <div className="writer-rankings">
            <h3>Top Writers</h3>
            <ul>
                {writers.map(writer => (
                    <li key={writer.id}>
                        <img src={writer.profileImage} width="50" alt="Writer Profile" />
                        {writer.username} - {writer.totalUpvotes} Upvotes <span>{writer.rank}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WriterRankings;
