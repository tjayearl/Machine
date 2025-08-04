document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://car4hire-coral.vercel.app/cars";
    const carDetailsContainer = document.getElementById("checkout-car-details");
    const checkoutForm = document.getElementById("checkout-form");

    const getCarIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("carId");
    };

    const fetchCarDetails = (carId) => {
        if (!carId) {
            carDetailsContainer.innerHTML = "<p>No car selected. Please go back to the homepage and select a car.</p>";
            return;
        }

        fetch(`${API_URL}/${carId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(car => {
                displayCarDetails(car);
            })
            .catch(error => {
                console.error("Error fetching car details:", error);
                carDetailsContainer.innerHTML = "<p>Sorry, we couldn't load the car details. Please try again later.</p>";
            });
    };

    const displayCarDetails = (car) => {
        carDetailsContainer.innerHTML = `
            <div class="car-card">
                <img src="${car.image}" alt="${car.name || 'Car Image'}">
                <div class="car-info">
                    <h3>${car.name || 'Unknown Model'}</h3>
                    <p><strong>Price:</strong> $${car.price || 'N/A'}</p>
                </div>
            </div>
        `;
    };
    
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // In a real application, you would process the payment here.
        alert("Thank you for your purchase! (This is a demo)");
        window.location.href = "index.html"; // Redirect back to home
    });

    const carId = getCarIdFromUrl();
    fetchCarDetails(carId);
});