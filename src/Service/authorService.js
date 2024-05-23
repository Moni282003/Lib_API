import axios from 'axios';


const API_BASE_URL = 'https://openlibrary.org';

export const fetchBooks = async (query, page) => {
  const response = await axios.get(`${API_BASE_URL}/search.json?q=${query}&page=${page}`);
  return response.data.docs;
};

export const getAuthorDetails = async (authorKey) => {
  const response = await axios.get(`${API_BASE_URL}/authors/${authorKey}.json`);
  return response.data;
};