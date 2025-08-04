document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://car4hire-coral.vercel.app/cars";
    const carDetailsContainer = document.getElementById("checkout-car-details");
    const checkoutForm = document.getElementById("checkout-form");
    const creditCardInfo = document.getElementById('credit-card-info');
    const creditCardInputs = creditCardInfo.querySelectorAll('input');
    const paymentMethodButtons = document.querySelectorAll('.payment-method-btn');
    const hiddenPaymentMethodInput = document.getElementById('payment-method-input');

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
    
    const toggleCreditCardFields = (show) => {
        if (show) {
            creditCardInfo.style.display = 'block';
            creditCardInputs.forEach(input => input.required = true);
        } else {
            creditCardInfo.style.display = 'none';
            creditCardInputs.forEach(input => {
                input.required = false;
                input.value = ''; // Clear fields when hiding
            });
        }
    };

    paymentMethodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            paymentMethodButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const selectedMethod = button.dataset.method;
            // Update the hidden input's value
            hiddenPaymentMethodInput.value = selectedMethod;

            // Show or hide the credit card fields based on the selection
            toggleCreditCardFields(selectedMethod === 'credit-card');
        });
    });

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // In a real application, you would process the payment here.
        alert("Thank you for your purchase! (This is a demo)");
        window.location.href = "index.html"; // Redirect back to home
    });

    const carId = getCarIdFromUrl();
    fetchCarDetails(carId);

    // Initialize the payment form state
    toggleCreditCardFields(hiddenPaymentMethodInput.value === 'credit-card');
});