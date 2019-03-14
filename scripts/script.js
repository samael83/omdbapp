// Globals
const searchBtn = document.querySelector('button');
const results = document.querySelector('ul');
const input = document.querySelector('input');
const more = document.querySelector('span');
let currentPageData;
let totalPages;
let currentPage;

// Events
searchBtn.addEventListener('click', handleSearch);
more.addEventListener('click', handleNext);

// Functions
function handleSearch() {
    // Reset content
    results.innerHTML = '';

    // Check for valid input
    if (input.value.length < 3) {
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
}

function initContent(movies) {
    // Stop function execution if search returned no results
    if (movies.Response == 'False') {
        console.log(`No results found, the movie you are looking for does not exist.`);
        //displayError();
        return;
    }

    // Set counters
    totalPages = Math.ceil(movies.totalResults / 10);
    currentPage = 1;

    // Render first page
    renderList(movies);

    // Prepare next page
    if (totalPages > 1) {
        fetchNext();        
    }

    // debugging **********************************************************************************************
    console.table(movies.Search);
    console.log(movies);
    console.log(`There are ${totalPages} pages for this query.`);
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
            <img src="${(movie.Poster == 'N/A') ? 'images/default_poster.jpg' : movie.Poster}"> 
            <p>${movie.Title}</p>
            <p>${movie.Year}</p>
            <a href="http://www.imdb.com/title/${movie.imdbID}/" target="_blank">IMDB</a>
        `;
        li.dataset.imdbid = movie.imdbID;
        li.classList.add('module');

        results.appendChild(li);
    }
}