// Variables
const searchBtn = document.querySelector('button');
const results = document.querySelector('ul');
const input = document.querySelector('input');
const more = document.querySelector('span');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

// Logic
function handleSearch() {
    if (input.value.length < 3) {
        console.log('Please specify a search term at lease 3 characters long.')
        return
    };
    const endpoint = `http://www.omdbapi.com/?apikey=d777cf78&s=${input.value}&type=movie&page=${1}`;

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

    // Variables
    let currentPageData;
    let totalPages = Math.ceil(movies.totalResults / 10);
    let currentPage = 1;

    // Render first page
    renderList(movies);

    if (totalPages > 1) {
        // Fetch next page
        fetchNext();

        // more btn event handler
        more.addEventListener('click', function() {
            if (totalPages > 1) {
                currentPage++;
                renderList(currentPageData);
                fetchNext();
                totalPages--;
            }
        });
    } 

    function fetchNext() {
        fetch(`http://www.omdbapi.com/?apikey=d777cf78&s=${input.value}&type=movie&page=${currentPage + 1}`)
            .then(response => response.json())
            .then(data => currentPageData = data);
    }

    // debugging
    console.table(movies.Search);
    console.log(movies);
    console.log(`There are ${totalPages} pages for this query.`);

}

function renderList(movies) {
    for (let movie of movies.Search) {
        let li = document.createElement('li');
        li.innerHTML = `<img src="${(movie.Poster == 'N/A') ? 'images/default_poster.jpg' : movie.Poster}"> ${movie.Title}`;
        li.dataset.imdbid = movie.imdbID;
        results.appendChild(li);
    }
}