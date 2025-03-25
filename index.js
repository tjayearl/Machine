document.addEventListener('DOMContentLoaded', () => {
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleForm = document.getElementById('add-vehicle-form');

    // Fetch vehicles from db.json
    function fetchVehicles() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                displayVehicles(data.vehicles);
            });
    }

    // Display vehicles
    function displayVehicles(vehicles) {
        vehicleList.innerHTML = '';
        vehicles.forEach(vehicle => {
            const vehicleDiv = document.createElement('div');
            vehicleDiv.classList.add('vehicle');
            vehicleDiv.innerHTML = `
                <h3>${vehicle.name}</h3>
                <p>Type: ${vehicle.type}</p>
                <p>Price: $${vehicle.price}</p>
                <p>${vehicle.description}</p>
            `;
            vehicleList.appendChild(vehicleDiv);
        });
    }

    // Add new vehicle
    addVehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newVehicle = {
            name: e.target.name.value,
            type: e.target.type.value,
            price: e.target.price.value,
            description: e.target.description.value
        };

        fetch('db.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVehicle)
        })
        .then(response => response.json())
        .then(() => {
            fetchVehicles();
            addVehicleForm.reset();
        });
    });

    // Initial vehicle load
    fetchVehicles();
});
