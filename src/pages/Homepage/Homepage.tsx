import React from 'react';
import { Link } from 'react-router-dom';

import { useLocalState } from '../../hooks';

const Homepage = () => {
  const [jwt] = useLocalState<string>('', 'jwt');
  return (
    <div style={{ margin: '2rem', display: 'inline-block' }}>
      <Link to={!jwt.length ? '/login' : '/dashboard'}>
        <h3>View Dashboard</h3>
      </Link>
    </div>
  );
};

export default Homepage;
