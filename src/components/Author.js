import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorDetails = () => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(
          'https://openlibrary.org/search/authors.json?q=j%20k%20rowling'
        );
        const authorData = response.data.docs[0];
        setAuthor(authorData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching author:', error);
        setError('Failed to fetch author information. Please try again later.');
        setLoading(false);
      }
    };

    fetchAuthor();
  }, []);

  if (loading) {
    return <p>Loading author details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Author Details</h2>
      <p>Name: {author.name}</p>
      <p>Birth Date: {author.birth_date}</p>
      <p>Top Work: {author.top_work}</p>
    </div>
  );
};

export default AuthorDetails;
