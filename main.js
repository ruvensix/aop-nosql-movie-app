document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const moviesContainer = document.getElementById('movies-container');
    const movieDetails = document.getElementById('movie-details');
    const detailContent = document.getElementById('detail-content');
    const commentsContainer = document.getElementById('comments-container');
    const backButton = document.getElementById('back-button');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
  
    // Fetch movies
    async function fetchMovies(query = '') {
      try {
        loadingElement.classList.remove('hidden');
        moviesContainer.innerHTML = '';
        errorElement.textContent = '';
  
        let url = '/.netlify/functions/getMovies';
        if (query) url += `?search=${encodeURIComponent(query)}`;
  
        const response = await fetch(url);
        const data = await response.json();
  
        data.length ? renderMovies(data)
                    : errorElement.textContent = 'No movies found.';
      } catch (error) {
        errorElement.textContent = `Error: ${error.message}`;
      } finally {
        loadingElement.classList.add('hidden');
      }
    }
  
    // Render movies grid
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
  
    // Render movie detail
    function renderMovieDetails(movie) {
      detailContent.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Year:</strong> ${movie.year || 'N/A'}</p>
        <img src="${movie.poster || 'https://via.placeholder.com/300x450'}" alt="${movie.title}" style="max-width: 300px;">
        <p><strong>Genres:</strong> ${movie.genres?.join(', ') || 'N/A'}</p>
        <p><strong>Plot:</strong> ${movie.plot || 'No plot available.'}</p>
        <p><strong>Cast:</strong> ${movie.cast?.join(', ') || 'N/A'}</p>
        <p><strong>Directors:</strong> ${movie.directors?.join(', ') || 'N/A'}</p>
      `;
    }
  
    // Render comments
    function renderComments(comments) {
      commentsContainer.innerHTML = '';
      if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments available.</p>';
        return;
      }
  
      comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
          <p><strong>${comment.name}</strong> (${new Date(comment.date).toLocaleDateString()}):</p>
          <p>${comment.text}</p>
        `;
        commentsContainer.appendChild(commentEl);
      });
    }
  
    // Fetch movie details
    async function fetchMovieDetails(id) {
      try {
        const response = await fetch(`/.netlify/functions/getMovie?id=${id}`);
        const data = await response.json();
  
        renderMovieDetails(data.movie);
        renderComments(data.comments);
  
        movieDetails.classList.remove('hidden');
        moviesContainer.classList.add('hidden');
      } catch (error) {
        errorElement.textContent = `Error: ${error.message}`;
      }
    }
  
    // Event listeners
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
  
    // Initial load
    fetchMovies();
  });
  