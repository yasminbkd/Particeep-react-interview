import React, { useEffect, useState } from 'react';
import { movies$ } from './movies'; 
import './MovieList.css'; 

const MovieList = () => {
  // State to store all movies, filtered movies, categories, selected categories, items per page, and the current page.
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch movies from the movies$ promise and set initial state
  useEffect(() => {
    movies$.then(movies => {
      setMovies(movies);
      setFilteredMovies(movies);
      setCategories([...new Set(movies.map(movie => movie.category))]); // Get unique categories
    });
  }, []);

  // Function to delete a movie by id
  const handleDelete = (id) => {
    const updatedMovies = movies.filter(movie => movie.id !== id); // Remove movie from the list
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    setCategories([...new Set(updatedMovies.map(movie => movie.category))]); // Update categories if needed
  };

  // Function to toggle like/dislike for a movie by id
  const handleToggleLikeDislike = (id) => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === id) {
        return {
          ...movie,
          likes: movie.likes > 0 ? movie.likes - 1 : movie.likes + 1, // Toggle likes
          dislikes: movie.dislikes > 0 ? movie.dislikes - 1 : movie.dislikes + 1, // Toggle dislikes
        };
      }
      return movie;
    });
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
  };

  // Function to filter movies by selected categories
  const handleFilter = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category) // Remove category from filter if already selected
      : [...selectedCategories, category]; // Add category to filter

    setSelectedCategories(updatedCategories);
    setFilteredMovies(
      updatedCategories.length
        ? movies.filter(movie => updatedCategories.includes(movie.category)) // Filter movies by selected categories
        : movies
    );
  };

  // Function to change the number of items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update items per page
    setCurrentPage(1); // Reset to first page
  };

  // Calculate the indices of the movies to display on the current page
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="movie-list">
      {/* Filter section to select categories */}
      <div className="filter-section">
        {categories.map(category => (
          <label key={category}>
            <input
              type="checkbox"
              value={category}
              onChange={() => handleFilter(category)} // Toggle filter on category selection
              checked={selectedCategories.includes(category)} // Check if category is selected
            />
            {category}
          </label>
        ))}
      </div>

      {/* Grid of movie cards */}
      <div className="movie-grid">
        {currentMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.category}</p>
            <div className="likes-dislikes">
              <div className="gauge">
                <div
                  className="likes"
                  style={{ width: `${(movie.likes / (movie.likes + movie.dislikes)) * 100}%` }} // Calculate like percentage
                />
              </div>
              <button onClick={() => handleToggleLikeDislike(movie.id)}>Toggle Like/Dislike</button>
            </div>
            <button onClick={() => handleDelete(movie.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredMovies.length / itemsPerPage)}
        >
          Next
        </button>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </div>
    </div>
  );
};

export default MovieList;
