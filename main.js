document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('movies-container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  async function fetchMovies(query = '') {
    const res = await fetch(`/.netlify/functions/getMovies?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    renderMovies(data);
  }

  function renderMovies(movies) {
    container.innerHTML = '';
    if (!movies.length) return container.innerHTML = '<p>No movies found.</p>';
    movies.forEach(movie => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${movie.title}</h3><p>${movie.year}</p>`;
      container.appendChild(div);
    });
  }

  searchButton.addEventListener('click', () => fetchMovies(searchInput.value));
  fetchMovies();
});
