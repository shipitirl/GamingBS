import { useEffect, useState } from "react";
import { fetchWriterRankings } from "../utils/rankingsUtils";

function WriterRankings() {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        fetchWriterRankings().then(setRankings);
    }, []);

    return (
        <div className="writer-rankings">
            <h2>Top Writers</h2>
            <ul>
                {rankings.map(writer => (
                    <li key={writer.id}>
                        {writer.name} - {writer.points} Points
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WriterRankings;
