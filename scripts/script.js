// Globals
const searchBtn = document.querySelector('#search-btn');
const results = document.querySelector('ul');
const input = document.querySelector('#search-input');
const loadNext = document.querySelector('span');
let currentPageData;
let totalPages;
let currentPage;

// Events
searchBtn.addEventListener('click', handleSearch);
loadNext.addEventListener('click', handleNext);

// Functions
function handleSearch() {
    // Reset content
    results.innerHTML = '';

    // Check for valid input
    if (input.value.length < 3) {
        // TO DO: switch console.log to displayError();
        console.log('Please specify a search term that is at least 3 characters long.');
        return;
    };

    const endpoint = `http://www.omdbapi.com/?apikey=d777cf78&s=${input.value}&type=movie&page=${1}`;

    // Fetch results and initialize content (to do: error handling)
    fetch(endpoint)
        .then(response => response.json())
        .then(data => initContent(data));
}

function handleNext() {
    if (totalPages > 1) {
        currentPage++;
        renderList(currentPageData);
        fetchNext();
        totalPages--;
    }
    if (totalPages <= 1) loadNext.classList.add('toggle-visibility');
}

function initContent(movies) {
    // Stop function execution if search returned no results
    if (movies.Response == 'False') {
        // TO DO: switch console.log to displayError();
        console.log(`No results found, the movie you are looking for does not exist.`);
        return;
    }

    // Set counters
    totalPages = Math.ceil(movies.totalResults / 10);
    currentPage = 1;

    // Render first page
    renderList(movies);

    // Prepare next page
    if (totalPages > 1) {
        loadNext.classList.remove('toggle-visibility');
        fetchNext();        
    }
}

function fetchNext() {
    fetch(`http://www.omdbapi.com/?apikey=d777cf78&s=${input.value}&type=movie&page=${currentPage + 1}`)
        .then(response => response.json())
        .then(data => currentPageData = data);
}

function renderList(movies) {
    for (let movie of movies.Search) {
        let li = document.createElement('li');
        li.innerHTML = `
            <img class="poster" src="${(movie.Poster == 'N/A') ? 'images/default_poster.jpg' : movie.Poster}"> 
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <a href="http://www.imdb.com/title/${movie.imdbID}/" target="_blank">IMDB</a>
        `;
        li.dataset.imdbid = movie.imdbID;
        li.classList.add('grid-cell');
        results.appendChild(li);
    }
}