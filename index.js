document.addEventListener("DOMContentLoaded", function () {
  let currentFilm = null;

  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(films => {
      renderFilms(films);
      if (films.length > 0) {
        showFilmDetails(films[0]);
      }
    })
    .catch(error => console.error("Error fetching films:", error));

  function createFilmListItem(film) {
    const li = document.createElement("li");
    li.className = "film item";
    li.dataset.id = film.id;
    li.textContent = film.title;
    li.addEventListener("click", () => showFilmDetails(film));
    return li;
  }

  document.querySelector("#buy-ticket").addEventListener("click", function () {
    if (currentFilm) {
      buyTicket(currentFilm);
    }
  });

  function renderFilms(films) {
    const filmsList = document.querySelector("#films");
    filmsList.innerHTML = "";
    films.forEach(film => {
      const li = createFilmListItem(film);
      filmsList.appendChild(li);
    });
  }

  function showFilmDetails(film) {
    currentFilm = film;
    const availableTickets = film.capacity - film.tickets_sold;
    const poster = document.querySelector("#poster");
    poster.src = film.poster && film.poster.startsWith("http") ? film.poster : "fallback-image.jpg";
    document.querySelector("#movie-title").textContent = film.title;
    document.querySelector("#runtime").textContent = `${film.runtime} mins`;
    document.querySelector("#showtime").textContent = film.showtime;
    document.querySelector("#description").textContent = film.description;
    document.querySelector("#tickets").textContent = `${availableTickets} remaining`;
    const buyBtn = document.querySelector("#buy-ticket");
    buyBtn.disabled = availableTickets <= 0;
    buyBtn.textContent = availableTickets <= 0 ? "Sold Out" : "Buy Ticket";
  }

  function updateUIAfterPurchase(film) {
    const availableTickets = film.capacity - film.tickets_sold;
    document.querySelector("#tickets").textContent = `${availableTickets} remaining`;
    const buyBtn = document.querySelector("#buy-ticket");
    buyBtn.disabled = availableTickets <= 0;
    buyBtn.textContent = availableTickets <= 0 ? "Sold Out" : "Buy Ticket";
    const li = document.querySelector(`#films li[data-id="${film.id}"]`);
    if (availableTickets <= 0 && li) {
      li.classList.add("sold-out");
    }
  }

  function buyTicket(film) {
    const availableTickets = film.capacity - film.tickets_sold;
    if (availableTickets <= 0) return;
    const updatedTicketsSold = film.tickets_sold + 1;
    fetch(`http://localhost:3000/films/${film.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    })
      .then(res => res.json())
      .then(updatedFilm => {
        film.tickets_sold = updatedFilm.tickets_sold;
        updateUIAfterPurchase(film);
        saveTicket(film);
      })
      .catch(err => console.error("Error buying ticket:", err));
  }

  function saveTicket(film) {
    fetch("http://localhost:3000/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: film.id,
        number_of_tickets: 1
      })
    })
      .then(res => res.json())
      .then(ticket => console.log("Ticket saved:", ticket))
      .catch(err => console.error("Error saving ticket:", err));
  }
  fetch("http://localhost:3000/films")
  .then(res => res.json())
  .then(films => {
    renderFilms(films);

    let currentFilm = films[0];
    displayFilmDetails(currentFilm); 

        films.forEach(film => {
      const filmElement = document.getElementById(`film-${film.id}`);
      filmElement.addEventListener("click", () => {
        currentFilm = film;
        displayFilmDetails(currentFilm);
      });
    });
  });
function displayFilmDetails(film) {
  const details = document.getElementById("film-details");
  details.innerHTML = `
    <h2>${film.title}</h2>
    <p>Director: ${film.director}</p>
    <p>Year: ${film.year}</p>
    <p>Tickets left: ${film.capacity - film.tickets_sold}</p>
    <button id="buy-ticket">Buy Ticket</button>
  `;
  document.getElementById("buy-ticket").addEventListener("click", () => {
    buyTicket(film);
  });
}

function buyTicket(film) {
  const availableTickets = film.capacity - film.tickets_sold;
  if (availableTickets <= 0) return;

  const updatedTicketsSold = film.tickets_sold + 1;

  fetch(`http://localhost:3000/films/${film.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets_sold: updatedTicketsSold })
  })
    .then(res => res.json())
    .then(updatedFilm => {
      film.tickets_sold = updatedFilm.tickets_sold;
      showFilmDetails(film); 
      saveTicket(film);
    })
    .catch(err => console.error("Error buying ticket:", err));
}
  });

