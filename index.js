document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(movie => displayMovieDetails(movie))
    .catch(error => console.error("Error fetching movie:", error));
});

function displayMovieDetails(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;

  const poster = document.querySelector("#poster");
  const title = document.querySelector("#title");
  const runtime = document.querySelector("#runtime");
  const showtime = document.querySelector("#showtime");
  const tickets = document.querySelector("#tickets");

  poster.src = movie.poster;
  poster.alt = movie.title;
  title.textContent = movie.title;
  runtime.textContent = `${movie.runtime} minutes`;
  showtime.textContent = movie.showtime;
  tickets.textContent = `Available Tickets: ${availableTickets}`;
}
let currentFilm = null;

async function displayFilmDetails(film) {
  currentFilm = film;

  const availableTickets = film.capacity - film.tickets_sold;

  document.querySelector("#poster").src = film.poster;
  document.querySelector("#title").textContent = film.title;
  document.querySelector("#runtime").textContent = `${film.runtime} minutes`;
  document.querySelector("#showtime").textContent = film.showtime;
  document.querySelector("#description").textContent = film.description;
  document.querySelector("#tickets").textContent = `${availableTickets} remaining`;
}

document.addEventListener("DOMContentLoaded", function () {
  let filmsList = document.querySelector("#films");

  function fetchFilms() {
    fetch("http://localhost:3000/films")
      .then(function (res) {
        return res.json();
      })
      .then(function (films) {
        renderFilms(films);
      })
      .catch(function (err) {
        console.error("Error loading films:", err);
      });
  }

  function renderFilms(films) {
    filmsList.innerHTML = "";

    films.forEach(function (film) {
      let li = createFilmListItem(film);
      filmsList.appendChild(li);
    });
  }

  function createFilmListItem(film) {
    let li = document.createElement("li");
    li.className = "film item";
    li.textContent = film.title;
    li.dataset.id = film.id;
    return li;
  }

  fetchFilms();
});

function fetchFirstFilm() {
    fetch("http://localhost:3000/films")
      .then(function (res) {
        return res.json();
      })
      .then(function (film) {
        displayFilmDetails(film);
      });
}


async function buyTicket() {
  if (!currentFilm) return;

  const availableTickets = currentFilm.capacity - currentFilm.tickets_sold;
  if (availableTickets <= 0) return;

  const updatedTicketsSold = currentFilm.tickets_sold + 1;

  const patchRes = await fetch(`http://localhost:3000/films/${currentFilm.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets_sold: updatedTicketsSold })
  })
    .then(function (res) { 
    return res.json(); 
    })
    .then(function (updatedFilm) {
    currentFilm = updatedFilm;
    displayFilmDetails(currentFilm);

  return fetch("http://localhost:3000/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      film_id: currentFilm.id,
      number_of_tickets: 1
    })
  });
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (ticket) {
      console.log("Ticket saved:", ticket);
    })
    .catch(function (err) {
       console.error("Error buying ticket:", err);
    });
}

document.querySelector("#buy-ticket").addEventListener("click", buyTicket);

fetchFirstFilm();

document.addEventListener("DOMContentLoaded", function () {
  let filmsList = document.querySelector("#films");

  function fetchFilms() {
    fetch("http://localhost:3000/films")
      .then(function (res) {
        return res.json();
      })
      .then(function (films) {
        renderFilms(films);
      })
      .catch(function (err) {
        console.error("Error loading films:", err);
      });
  }

  function renderFilms(films) {
    filmsList.innerHTML = "";

    films.forEach(function (film) {
      let li = document.createElement("li");
      li.className = "film item";
      li.dataset.id = film.id;
      li.textContent = film.title + " ";

      let deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation(); 
        deleteFilm(film.id, li);
      });

      li.appendChild(deleteBtn);
      filmsList.appendChild(li);
    });
  }

  function deleteFilm(filmId, liElement) {
    fetch("http://localhost:3000/films/" + filmId, {
      method: "DELETE"
    })
      .then(function (res) {
        if (res.ok) {
          liElement.remove();
        } else {
          console.error("Failed to delete film with id " + filmId);
        }
      })
      .catch(function (err) {
        console.error("Error deleting film:", err);
      });
  }

  fetchFilms();
});

  function fetchFilms() {
    fetch("http://localhost:3000/films")
      .then(function (res) {
        return res.json();
      })
      .then(function (films) {
        renderFilms(films);
        if (films.length > 0) {
          showFilmDetails(films[0]); // show first movie
        }
      })
      .catch(function (err) {
        console.error("Error loading films:", err);
      });
  }

  function renderFilms(films) {
    filmsList.innerHTML = "";

    films.forEach(function (film) {
      let li = createFilmListItem(film);
      filmsList.appendChild(li);
    });
  }

  function createFilmListItem(film) {
    let li = document.createElement("li");
    li.className = "film item";
    li.dataset.id = film.id;
    li.textContent = film.title;

    if (film.capacity - film.tickets_sold <= 0) {
      li.classList.add("sold-out");
    }

    li.addEventListener("click", function () {
      showFilmDetails(film);
    });

    return li;
  }

  function showFilmDetails(film) {
    let availableTickets = film.capacity - film.tickets_sold;

    details.innerHTML = `
      <h2>${film.title}</h2>
      <img src="${film.poster}" alt="${film.title}" style="width:200px;">
      <p><strong>Runtime:</strong> ${film.runtime} mins</p>
      <p><strong>Showtime:</strong> ${film.showtime}</p>
      <p><strong>Tickets Available:</strong> <span id="tickets-${film.id}">${availableTickets}</span></p>
      <button id="buy-ticket">${availableTickets > 0 ? "Buy Ticket" : "Sold Out"}</button>
    `;

    let btn = document.querySelector("#buy-ticket");
    if (availableTickets > 0) {
      btn.addEventListener("click", function () {
        buyTicket(film);
      });
    } else {
      btn.disabled = true;
    }
  }

  function buyTicket(film) {
    let availableTickets = film.capacity - film.tickets_sold;

    if (availableTickets <= 0) {
      return;
    }

    let newTicketsSold = film.tickets_sold + 1;

    fetch("http://localhost:3000/films/" + film.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tickets_sold: newTicketsSold })
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (updatedFilm) {
        film.tickets_sold = updatedFilm.tickets_sold;
        updateUIAfterPurchase(film);
      })
      .catch(function (err) {
        console.error("Error buying ticket:", err);
      });
  }

  function updateUIAfterPurchase(film) {
    let availableTickets = film.capacity - film.tickets_sold;
    let ticketsSpan = document.querySelector("#tickets-" + film.id);
    let btn = document.querySelector("#buy-ticket");
    let li = filmsList.querySelector('li[data-id="' + film.id + '"]');

    if (ticketsSpan) {
      ticketsSpan.textContent = availableTickets;
    }

    if (availableTickets <= 0) {
      btn.textContent = "Sold Out";
      btn.disabled = true;
      if (li) {
        li.classList.add("sold-out");
      }
    }
  }

  fetchFilms();


  currentFilm = updatedFilm;
  const newAvailable = currentFilm.capacity - currentFilm.tickets_sold;

  document.querySelector("#tickets").textContent = `${newAvailable} remaining`;

  const buyBtn = document.querySelector("#buy-ticket");
  if (newAvailable === 0) {
    buyBtn.textContent = "Sold Out";
    buyBtn.disabled = true;

    const li = document.querySelector(`#films li[data-id="${currentFilm.id}"]`);
    if (li) li.classList.add("sold-out");
  }

  displayFirstMovie();
  loadFilmMenu();