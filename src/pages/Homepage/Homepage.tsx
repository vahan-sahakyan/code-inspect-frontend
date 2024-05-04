import React from 'react';
import { Link } from 'react-router-dom';

import { useLocalState } from '../../hooks';

const Homepage = () => {
  const [jwt] = useLocalState<string>('', 'jwt');
  return (
    <div
      style={{
        margin: '2rem',
        display: 'grid',
        placeContent: 'center',
        height: '80vh',
      }}
    >
      CODE INSPECT
      <Link to={!jwt.length ? '/login' : '/dashboard'}>
        <h3>Get Started</h3>
      </Link>
    </div>
  );
};

export default Homepage;
