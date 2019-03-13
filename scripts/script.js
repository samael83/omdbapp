// Variables
const searchBtn = document.querySelector('button');
const results = document.querySelector('ul');
let pageNum; // to be used for sending request for the items in the next page (if exists)

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

// Logic
function handleSearch() {

    // to do: validation that the search term is at least 3 characters long
    const searchTerm = document.querySelector('input').value;
    const endpoint = `http://www.omdbapi.com/?apikey=d777cf78&s=${searchTerm}&type=movie&page=${pageNum || 1}`;

    // to do: error handling
    fetch(endpoint)
        .then(response => response.json())
        .then(data => initContent(data));

}

function initContent(val) {

    const pages = Math.ceil(val.totalResults/10);
    // to do: conditional to disable 'load more results' when last page is loaded (btn not yet added)
    // to do: functionality to clear previous search results

    for (let movie of val.Search) {
        // to do: default image for the case of missing movie poster
        let li = document.createElement('li');
        li.dataset.imdbid = movie.imdbID;
        results.appendChild(li).innerHTML = `<img src="${movie.Poster}" height="75"> ${movie.Title}`; // <= REFACTOR
    }

    // debugging
    console.table(val.Search);
    console.log(val);
    console.log(`There are ${pages} pages for this query.`);
}

