document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements (as described in the document) [cite: 61]
  const moviesContainer = document.getElementById('movies-container');
  const movieDetails = document.getElementById('movie-details');
  const detailContent = document.getElementById('detail-content');
  const commentsContainer = document.getElementById('comments-container');
  const backButton = document.getElementById('back-button');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  // Fetch movies [cite: 62, 63, 64, 65]
  async function fetchMovies(query = '') {
      try {
          loadingElement.classList.remove('hidden');
          moviesContainer.innerHTML = '';
          let url = '/.netlify/functions/getMovies';
          if (query) url += `?search=${encodeURIComponent(query)}`;
          const response = await fetch(url);
          const data = await response.json();
          data.length ? renderMovies(data) : errorElement.textContent = 'No movies found.';
      } catch (error) {
          errorElement.textContent = `Error: ${error.message}`;
      } finally {
          loadingElement.classList.add('hidden');
      }
  }

  // Render movies grid [cite: 66, 67, 68, 69, 70]
  function renderMovies(movies) {
      movies.forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.className = 'movie-card';
          movieCard.setAttribute('data-id', movie._id);
          const posterUrl = movie.poster || 'https://via.placeholder.com/300x450';
          movieCard.innerHTML = `
              <img src="${posterUrl}" alt="${movie.title}">
              <div class="movie-info">
                  <h3>${movie.title}</h3>
                  <p>${movie.year || 'N/A'}</p>
              </div>
          `;
          movieCard.addEventListener('click', () => {
              fetchMovieDetails(movie._id);
          });
          moviesContainer.appendChild(movieCard);
      });
  }

  // Event handlers [cite: 68, 69, 70]
  backButton.addEventListener('click', () => {
      movieDetails.classList.add('hidden');
      moviesContainer.classList.remove('hidden');
  });
  searchButton.addEventListener('click', () => {
      fetchMovies(searchInput.value.trim());
  });
  searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          fetchMovies(searchInput.value.trim());
      }
  });

  // Fetch movie details function [cite: 71, 72, 73, 74, 75]
  async function fetchMovieDetails(id) {
      try {
          const response = await fetch(`/.netlify/functions/getMovie?id=${id}`);
          const data = await response.json();
          renderMovieDetails(data.movie);
          renderComments(data.comments);
          movieDetails.classList.remove('hidden');
      } catch (error) {
          errorElement.textContent = `Error: ${error.message}`;
      }
  }

  // Initial load [cite: 75]
  fetchMovies();
});