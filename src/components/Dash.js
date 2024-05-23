import React from 'react';
import { useParams } from 'react-router-dom';
import BookDetails from './AuthorSearch';
import Header from './Header';
import Footer from './Footer';

const Dashboard = () => {
  const { username } = useParams();

  return (
    <div>
      <Header/>
      <h1 className='user'>Welcome, {username}!</h1>

      <BookDetails/>
      <Footer/>
    </div>
  );
};

export default Dashboard;
