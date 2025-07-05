document.addEventListener("DOMContentLoaded", () => {
    fetchCars();
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
