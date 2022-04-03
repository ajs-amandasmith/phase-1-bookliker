document.addEventListener("DOMContentLoaded", function() {
  getBookData();
});

function getBookData() {
  fetch('http://localhost:3000/books')
  .then(response => response.json())
  .then(data => showBookData(data));
}

function showBookData(bookArray) {
  const bookList = document.getElementById('list');
  bookList.innerHTML = '';
  bookArray.map(book => {
    const li = document.createElement('li');
    li.textContent = book.title;
    li.dataset.id = book.id;
    bookList.append(li);
  })
  clickBook(bookList, bookArray);
}

function clickBook(bookList, bookDataArray) {
  const bookListItems = bookList.childNodes;
  const bookListArray = [...bookListItems];
  bookListArray.map(book => {
    book.addEventListener('click', (e) => handleClickBook(e, bookDataArray))
  })
}

function handleClickBook(e, bookData) {
  const showPanelElement = document.getElementById('show-panel');
  showPanelElement.innerHTML = '';
  let bookId = e.target.dataset.id;
  let bookDataIndex = bookData[bookId - 1];
  let users = bookDataIndex.users;

  const image = document.createElement('img');
  const titleElement = document.createElement('h2');
  const subtitleElement = document.createElement('h2');
  const authorElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');
  const userListElement = document.createElement('ul');
  const likeButtonElement = document.createElement('button');
  
  users.map(user => {
    const userElement = document.createElement('li');
    userElement.id = user.id;
    userElement.textContent = user.username
    userListElement.append(userElement);
  });  

  image.src = bookDataIndex.img_url;
  titleElement.textContent = bookDataIndex.title;
  subtitleElement.textContent = bookDataIndex.subtitle;
  authorElement.textContent = bookDataIndex.author;
  descriptionElement.textContent = bookDataIndex.description;

  users.map(user => {
    if (user.id === 1) {
      likeButtonElement.textContent = "UNLIKE";
    } else {
      likeButtonElement.textContent = "LIKE";
    }
  })

  showPanelElement.append(image, titleElement, subtitleElement, authorElement, descriptionElement, userListElement, likeButtonElement);

  clickLike(showPanelElement, bookDataIndex, users);
}

function clickLike(panelElement, bookDataIndex, users) {
  const likeButton = panelElement.querySelector('button');
  likeButton.addEventListener('click', e => handleClickLike(e, bookDataIndex, users, panelElement));
}

function handleClickLike(e, bookDataIndex, users, panelElement) {
  const bookId = bookDataIndex.id;
  const likeBtn = panelElement.childNodes[6]

  fetch(`http://localhost:3000/users/1`)
    .then(response => response.json())
    .then(data => {

      const hasUserLikedBook = users.filter(user => user.id === data.id);

      if (hasUserLikedBook.length === 0) {
        users.push(data);
        likeBtn.textContent = 'UNLIKE';
      } else {
        for (key in users) {
          if (users[key].id === data.id) {
            users.pop(key);
            likeBtn.textContent = 'LIKE';
          }
        }
      }
      
      fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          users
        })
      })
      .then(response => response.json())
      .then(data => {
        const panelElement = document.getElementById('show-panel')
        let ul = panelElement.childNodes[5];
        ul.innerHTML = '';

        users.map(user => {
          const li = document.createElement('li');
          li.textContent = user.username;
          ul.append(li);
        })
      })
    })
}