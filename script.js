function searchBooks() {
    const query = document.getElementById('search-query').value.trim();
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    const spinner = document.getElementById('loading-spinner');
    const bookList = document.getElementById('book-list');
    const searchButton = document.getElementById('search-button');

    // Show spinner and disable button
    spinner.style.display = 'inline-block';
    searchButton.disabled = true;
    bookList.innerHTML = '';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const books = data.docs;

            if (books.length > 0) {
                books.slice(0, 10).forEach(book => {
                    const title = book.title;
                    const author = book.author_name ? book.author_name.join(', ') : null;
                    const coverId = book.cover_i;
                    const publishYear = book.first_publish_year || null;
                    const editionCount = book.edition_count || null;
                    const languages = book.language ? book.language.map(code => getLanguageName(code)).join(', ') : null;
                    const bookUrl = `https://openlibrary.org${book.key}`;

                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');

                    const coverImg = coverId
                        ? `<img src="https://covers.openlibrary.org/b/id/${coverId}-M.jpg" alt="${title} cover">`
                        : `<img src="https://via.placeholder.com/100x150?text=No+Cover" alt="No cover">`;

                    let bookInfoHTML = `
                        <h3><a href="${bookUrl}" target="_blank">${title}</a></h3>
                        ${author ? `<p><strong>Author:</strong> ${author}</p>` : ''}
                        ${publishYear ? `<p><strong>First Published:</strong> ${publishYear}</p>` : ''}
                        ${editionCount ? `<p><strong>Editions:</strong> ${editionCount}</p>` : ''}
                        ${languages ? `<p><strong>Language:</strong> ${languages}</p>` : ''}
                    `;

                    bookItem.innerHTML = `
                        ${coverImg}
                        <div class="book-info">
                            ${bookInfoHTML}
                        </div>
                    `;

                    bookList.appendChild(bookItem);
                });
            } else {
                bookList.innerHTML = '<p>No books found. Try another search.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            bookList.innerHTML = '<p>Error fetching books. Please try again later.</p>';
        })
        .finally(() => {
            spinner.style.display = 'none';
            searchButton.disabled = false;
        });
}

function getLanguageName(code) {
    const languages = {
        "eng": "English",
        "fre": "French",
        "spa": "Spanish",
        "ger": "German",
        "ita": "Italian",
        "hin": "Hindi",
        "ara": "Arabic"
        // Add more if needed
    };
    return languages[code] || code;
}
