document.addEventListener("DOMContentLoaded", function() {
    const showPanel = document.querySelector('#show-panel');
  
  // Event listener for book title clicks
  document.querySelector('#list').addEventListener('click', event => {
    const bookId = event.target.dataset.bookId;

    // Fetch the details of the clicked book
    fetch(`http://localhost:3000/books/${bookId}`)
      .then(response => response.json())
      .then(book => {
        showBookDetails(book);
      });
  });

  // Function to display book details
  function showBookDetails(book) {
    const bookDetails = document.querySelector('#book-details');
    bookDetails.innerHTML = '';  // Clear previous content

    // Book info
    const thumbnail = document.createElement('img');
    thumbnail.src = book.thumbnail;
    bookDetails.appendChild(thumbnail);

    const description = document.createElement('p');
    description.textContent = book.description;
    bookDetails.appendChild(description);

    // List of users who like the book
    const userList = document.createElement('ul');
    book.users.forEach(user => {
      const userItem = document.createElement('li');
      userItem.textContent = user.username;
      userList.appendChild(userItem);
    });
    bookDetails.appendChild(userList);

    // Like button
    const likeButton = document.createElement('button');
    likeButton.textContent = 'LIKE';
    likeButton.addEventListener('click', () => handleLike(book));
    bookDetails.appendChild(likeButton);
  }

  // Handle like/unlike functionality
  function handleLike(book) {
    const currentUser = { id: 1, username: 'pouros' };  // Example user
    const users = book.users;

    // Check if the current user already liked the book
    const userIndex = users.findIndex(user => user.id === currentUser.id);

    if (userIndex === -1) {
      // User hasn't liked the book, so add them
      users.push(currentUser);
    } else {
      // User already liked, so remove them
      users.splice(userIndex, 1);
    }

    // Update the book with the new users array
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: users })
    })
      .then(response => response.json())
      .then(updatedBook => {
        showBookDetails(updatedBook);  // Re-render book details with updated users
      });
  }
});
