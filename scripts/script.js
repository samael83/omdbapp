// Variables
const searchBtn = document.querySelector('button');
const results = document.querySelector('ul');
const input = document.querySelector('input');
let pageNum; // to be used for sending request for the items in the next page (if exists)

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

// Logic
function handleSearch() {

    // to do: validation that the search term is at least 3 characters long
    const endpoint = `http://www.omdbapi.com/?apikey=d777cf78&s=${input.value}&type=movie&page=${pageNum || 1}`;

    // to do: error handling
    fetch(endpoint)
        .then(response => response.json())
        .then(data => initContent(data));

}

function initContent(movies) {

    // Reset content
    results.innerHTML = '';

    // Stop function if search failed
    if (movies.Response == 'False') {
        console.log(`The movie you are looking for does not exist.`);
        return;
    }

    // Number of total pages
    const pages = Math.ceil(movies.totalResults/10);

    // Show first page
    for (let movie of movies.Search) { // to do: move into a separate function
        let li = document.createElement('li');
        li.innerHTML = `<img src="${(movie.Poster == 'N/A') ? 'images/default_poster.jpg' : movie.Poster}" height="75"> ${movie.Title}`;
        li.dataset.imdbid = movie.imdbID;
        results.appendChild(li);
    }

    // Fetch next Page    

    // to do: conditional to disable 'load more results' when last page is loaded (btn not yet added)

    // debugging
    console.table(movies.Search);
    console.log(movies);
    console.log(`There are ${pages} pages for this query.`);

}