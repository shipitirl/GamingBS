import { Link } from 'react-router-dom';

const Navbar = () => {
  console.log('Navbar rendering');
  return (
    <nav style={{ 
      padding: '20px', 
      backgroundColor: '#333',
      color: 'white',
      border: '2px solid orange'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none',
          padding: '5px',
          backgroundColor: '#666'
        }}>Home</Link>
        <Link to="/journalist" style={{ 
          color: 'white',
          textDecoration: 'none',
          padding: '5px',
          backgroundColor: '#666'
        }}>Journalist Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar; 