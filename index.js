document.addEventListener("DOMContentLoaded", () => {
    fetchCars();

    // Modal logic
    const authModal = document.getElementById("auth-modal");
    const loginBtnHeader = document.getElementById("login-btn-header");
    const closeBtn = document.querySelector(".close-btn");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    if (loginBtnHeader) {
        loginBtnHeader.onclick = function() {
            authModal.style.display = "block";
            // Show login form and hide register form by default
            loginForm.style.display = "flex";
            registerForm.style.display = "none";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            authModal.style.display = "none";
        }
    }

    // Close the modal if the user clicks anywhere outside of the modal content
    window.onclick = function(event) {
        if (event.target == authModal) {
            authModal.style.display = "none";
        }
    }

    // Toggle to Register form
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        });
    }

    // Toggle to Login form
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            console.log("Login attempt with:", { email, password });
            // Here you would typically send a request to your backend to authenticate the user
            alert("Login functionality not yet implemented. Check console for data.");
            loginForm.reset();
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            console.log("Registering with:", { name, email, password });
            // Here you would typically send a request to your backend to create a new user
            alert("Registration functionality not yet implemented. Check console for data.");
            registerForm.reset();
        });
    }
});

const API_URL = "https://car4hire-coral.vercel.app/cars";       


function fetchCars() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched cars:", data); // Debugging log
            displayCars(data);
        })
        .catch(error => console.error("Error fetching cars:", error));
}

function displayCars(cars) {
    const carListings = document.getElementById("car-listings");
    if (!carListings) {
        console.error("Error: #car-listings element not found");
        return;
    }
    carListings.innerHTML = ""; // Clear any existing content

    const categories = {};

    cars.forEach(car => {
        if (!categories[car.category]) {
            categories[car.category] = [];
        }
        categories[car.category].push(car);
    });

    for (const category in categories) {
        const categorySection = document.createElement("section");
        categorySection.classList.add("car-category");
        categorySection.id = category;
        categorySection.innerHTML = `<h2>${category.toUpperCase()}</h2>`;

        categories[category].forEach(car => {
            console.log("Car Image URL:", car.image); // Debugging log for images

            const carCard = document.createElement("div");
            carCard.classList.add("car-card");

            if (car.status === 'sold') {
                carCard.classList.add('sold');
            }

            const buttonContent = car.status === 'sold'
                ? `<p class="sold-text">SOLD</p>`
                : `<button onclick="buyCar(${car.id})">Buy</button>
                   <button onclick="updateCarStatus(${car.id})">
                       ${car.inStock ? 'Rent' : 'Available'}
                   </button>`;

            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.name || 'Car Image'}" onerror="this.src='default-car.jpg'">
                <div class="car-info">
                    <h3>${car.name || 'Unknown Model'}</h3>
                    <p><strong>Color:</strong> ${car.color || 'N/A'}</p>
                    <p><strong>Engine:</strong> ${car.engine || 'N/A'}</p>
                    <p><strong>Manufactured:</strong> ${car.manufactured || 'N/A'}</p>
                    <p><strong>Price:</strong> $${car.price || 'N/A'}</p>
                    <div class="button-container">
                        ${buttonContent}
                    </div>
                </div>
            `;
            categorySection.appendChild(carCard);
        });
        carListings.appendChild(categorySection);
    }
}

function buyCar(id) {
    // Redirect to the checkout page with the car's ID
    window.location.href = `checkout.html?carId=${id}`;
}

function updateCarStatus(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(car => {
            const updatedCar = { inStock: !car.inStock };
            return fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCar)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`Car status updated for ID ${id}.`);
            fetchCars();
        })
        .catch(error => console.error("Error updating car status:", error));
}
