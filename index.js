document.addEventListener("DOMContentLoaded", () => {
    fetchCars();
});

function fetchCars() {
    fetch("https://machine-lac.vercel.app/")
        .then(response => response.json())
        .then(data => {
            displayCars(data);
        })
        .catch(error => console.error("Error fetching cars:", error));
}

function displayCars(cars) {
    const carListings = document.getElementById("car-listings");
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
            // Log image URL to check for correctness
            console.log("Car Image URL:", car.image);

            const carCard = document.createElement("div");
            carCard.classList.add("car-card");
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.name || 'Car Image'}">  <!-- Fallback alt text -->
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <p><strong>Color:</strong> ${car.color}</p>
                    <p><strong>Engine:</strong> ${car.engine}</p>
                    <p><strong>Manufactured:</strong> ${car.manufactured}</p>
                    <p><strong>Price:</strong> $${car.price}</p>
                    <div class="button-container">
                        <button onclick="buyCar(${car.id})">Buy</button>
                        <button onclick="updateCarStatus(${car.id})">${car.inStock ? 'Rent' : 'Available'}</button>
                    </div>
                </div>
            `;
            categorySection.appendChild(carCard);
        });

        carListings.appendChild(categorySection);
    }
}

function buyCar(id) {
    fetch(`https://machine-lac.vercel.app//cars/${id}`, { method: "DELETE" })
        .then(() => fetchCars())
        .catch(error => console.error("Error deleting car:", error));
}

function updateCarStatus(id) {
    fetch(`https://machine-lac.vercel.app//cars/${id}`)
        .then(response => response.json())
        .then(car => {
            car.inStock = !car.inStock;
            fetch(`https://machine-lac.vercel.app//cars/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inStock: car.inStock })
            })
            .then(() => fetchCars())
            .catch(error => console.error("Error updating car status:", error));
        })
        .catch(error => console.error("Error fetching car:", error));
}
