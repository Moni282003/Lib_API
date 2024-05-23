import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const BookDetails = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorDetails, setAuthorDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDataLoaded, setTotalDataLoaded] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=a&fields=title,author_name,first_publish_year,ratings_average,subject&limit=100`
        );
        if (response.status === 200) {
          setBooks(response.data.docs);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch initial data.');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch initial data. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchAuthorDetails = async (authorName) => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`
        );
        const authorData = response.data.docs[0];
        setAuthorDetails((prevDetails) => ({
          ...prevDetails,
          [authorName]: authorData,
        }));
      } catch (error) {
        console.error('Error fetching author details:', error);
      }
    };

    if (books.length > 0) {
      books.forEach((book) => {
        const authorName = book.author_name && book.author_name[0];
        if (authorName && !authorDetails[authorName]) {
          fetchAuthorDetails(authorName);
        }
      });
    }
  }, [books, authorDetails]);

  const fetchNextData = async () => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=a&fields=title,author_name,first_publish_year,ratings_average,subject&limit=50&offset=${books.length}`
      );
      setBooks((prevBooks) => prevBooks.concat(response.data.docs));
      setTotalDataLoaded(true);
    } catch (error) {
      console.error('Error fetching remaining data:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = (index, newData) => {
    const updatedBooks = [...books];
    updatedBooks[index] = newData;
    setBooks(updatedBooks);
    setEditIndex(-1);
  };

  const handleCancel = () => {
    setEditIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e, index, fieldName) => {
    const { value } = e.target;
    const updatedBooks = [...books];
    updatedBooks[index][fieldName] = value;
    setBooks(updatedBooks);
  };

  const filteredBooks = books.filter((book) => {
    return book.author_name && book.author_name[0].toLowerCase().includes(searchTerm.toLowerCase());
  });

  const convertToCSV = (data) => {
    const header = ['title', 'author_name', 'first_publish_year', 'ratings_average', 'subject', 'author_birth', 'top_work'];
    const rows = data.map((row) => {
      const authorName = row.author_name && row.author_name[0];
      return {
        ...row,
        author_birth: authorDetails[authorName]?.birth_date || 'N/A',
        top_work: authorDetails[authorName]?.top_work || 'N/A',
      };
    }).map((row) => header.map((field) => row[field] || 'N/A').join(',')).join('\n');
    return `${header.join(',')}\n${rows}`;
  };

  const handleDownloadCSV = () => {
    const csvData = convertToCSV(books);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'books.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
    if (page === totalPages && !totalDataLoaded) {
      fetchNextData();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  
  const sortData = (data, column, direction) => {
    const sortedData = [...data].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
  
      if (column === 'author_birth' || column === 'top_work') {
        aValue = authorDetails[a.author_name[0]]?.[column === 'author_birth' ? 'birth_date' : 'top_work'] || 'N/A';
        bValue = authorDetails[b.author_name[0]]?.[column === 'author_birth' ? 'birth_date' : 'top_work'] || 'N/A';
      }
  
      if (column === 'subject') {
        aValue = a.subject && a.subject[1] ? a.subject[1] : 'N/A';
        bValue = b.subject && b.subject[1] ? b.subject[1] : 'N/A';
      }
  
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };
  
  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  const sortedBooks = sortColumn ? sortData(filteredBooks, sortColumn, sortDirection) : filteredBooks;

  return (
    <div className='book_main'>
      <h2 className='header_lib'>Book Details Dashboard</h2>
      <div>
        <select className='select' onChange={(e) => handleSort(e.target.value)}>
          {['ratings_average', 'author_name', 'author_birth', 'subject', 'top_work', 'title', 'first_publish_year'].map((column) => (
            <option key={column} value={column}>{column.replace('_', ' ')}</option>
          ))}
        </select>
        <select className='select' onChange={(e) => setSortDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        <input className='search' type="text" placeholder="Search by author" value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div>
        <select className='select' value={rowsPerPage} onChange={handleChangeRowsPerPage}>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            {['ratings_average', 'author_name', 'author_birth', 'subject', 'top_work', 'title', 'first_publish_year'].map((column) => (
              <th key={column} onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
                {column.replace('_', ' ')}
                {sortColumn === column ? (sortDirection === 'asc' ? '▼' : ' ▲') : ' ▲▼'}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((book, index) => (
              <tr key={index} style={{ height: '50px' }}>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={book.ratings_average}
                      onChange={(e) => handleInputChange(e, index, 'ratings_average')}
                    />
                  ) : (
                    Number(book.ratings_average).toFixed(2) || 'N/A'
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={book.author_name && book.author_name[0]}
                      onChange={(e) => handleInputChange(e, index, 'author_name')}
                    />
                  ) : (
                    book.author_name && book.author_name[0]
                  )}
                </td>
                <td>{authorDetails[book.author_name[0]]?.birth_date || 'N/A'}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={book.subject && book.subject[1] ? book.subject[1] : 'N/A'}
                      onChange={(e) => handleInputChange(e, index, 'subject')}
                    />
                  ) : (
                    book.subject && book.subject[1] ? book.subject[1] : 'N/A'
                  )}
                </td>
                <td>{authorDetails[book.author_name[0]]?.top_work || 'N/A'}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={book.title}
                      onChange={(e) => handleInputChange(e, index, 'title')}
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={book.first_publish_year}
                      onChange={(e) => handleInputChange(e, index, 'first_publish_year')}
                    />
                  ) : (
                    book.first_publish_year
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <div>
                      <button onClick={() => handleSave(index, books[index])}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <button className='edit' onClick={() => handleEdit(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className='download_cnt'>
        <button onClick={handleDownloadCSV} className='download'>Download CSV</button>
      </div>
    </div>
  );
};

export default BookDetails;

