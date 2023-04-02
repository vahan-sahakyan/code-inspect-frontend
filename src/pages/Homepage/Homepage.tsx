import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div style={{ margin: '2rem', display: 'inline-block' }}>
      <Link to={'/dashboard'}>
        <h3>Go to Dashboard</h3>
      </Link>
    </div>
  );
};

export default Homepage;
