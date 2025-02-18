import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      {/* Add more content as needed */}
      <footer>
        <p>
            <Link to="/journalist-dashboard">Journalist Dashboard</Link>
        </p>
      </footer>
    </div>
  );
};

export default Home;
