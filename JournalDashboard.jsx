function JournalDashboard({ user }) {
    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <img src={user.profileImage} alt="Profile" width="80" />
            <h2>Your Articles</h2>
            <ul>
                {user.articles.map(article => (
                    <li key={article._id}>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <p>Upvotes: {article.upvotes}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default JournalDashboard;
