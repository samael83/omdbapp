// Globals
const body = document.querySelector('body');
const searchBtn = document.querySelector('#search-btn');
const results = document.querySelector('#grid-main');
const input = document.querySelector('#search-input');
const nextBtn = document.querySelector('#next-btn');
const moviePage = document.querySelector('.movie-details');
const mainStage = document.querySelector('.main-stage');
const errBox = document.querySelector('.error');
let movieList = [];
let currentPageData;
let totalPages;
let currentPage;

// Events
searchBtn.addEventListener('click', handleSearch);
nextBtn.addEventListener('click', handleNext);
moviePage.addEventListener('click', function() {
    this.classList.add('hide-visibility');
    body.classList.remove('hide-overflow');
});
window.addEventListener('keydown', function(e) {
    if (e.key == 'Escape') moviePage.classList.add('hide-visibility');
    body.classList.remove('hide-overflow');
});

// Functions
function handleSearch() {
    // Reset content
    results.innerHTML = '';
    errBox.innerHTML = '';
    currentPageData = {};
    nextBtn.classList.add('hide-visibility');

    // Check for valid input, stop execution if input not valid
    if (input.value.length < 3) {
        errBox.innerHTML = `
            <p class="err-message">Please specify a search term that is at least 3 charcters long.</>
        `;
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
    if (totalPages <= 1) nextBtn.classList.add('hide-visibility');
}

function initContent(movies) {
    // Stop function execution if search returned no results
    if (movies.Response == 'False') {
        errBox.innerHTML = `
            <p class="err-message">Movie not found.</>
        `;
        return;
    }

    // Set counters
    totalPages = Math.ceil(movies.totalResults / 10);
    currentPage = 1;

    // Render first page
    renderList(movies);

    // Prepare next page
    if (totalPages > 1) {
        nextBtn.classList.remove('hide-visibility');
        fetchNext();        
    }

    // Fetch and load movie's full details
    movieList.forEach( movie => movie.addEventListener('click', function() {
        fetch(`http://www.omdbapi.com/?apikey=d777cf78&i=${this.dataset.imdbid}`)
            .then(response => response.json())
            .then(data => renderMoviePage(data));
    }));
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
            <a href="http://www.imdb.com/title/${movie.imdbID}/" target="_blank"><img src="./images/imdb.png" height="18" ></a>
        `;
        li.dataset.imdbid = movie.imdbID;
        li.classList.add('grid-cell');
        results.appendChild(li);
        movieList.push(li);
    }
}

function renderMoviePage(val) {
    moviePage.classList.remove('hide-visibility');
    body.classList.add('hide-overflow');
    moviePage.innerHTML = `
        <div class="wrapper">
            <img class="poster" src="${(val.Poster == 'N/A') ? 'images/default_poster.jpg' : val.Poster}"> 
            <h3>${val.Title}</h3>
            <h3>${val.Year}</h3>
            <p>Summary: ${val.Plot}</p>
            <p>Genre: ${val.Genre}</p>
            <p>Directed by: ${val.Director}</p>
        </div>
    `;
}