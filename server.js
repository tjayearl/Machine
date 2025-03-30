const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load car data (for now, we'll use the sample data you provided in a JSON file)
const carsFilePath = path.join(__dirname, 'db.json');

// Get all cars
app.get('/api/cars', (req, res) => {
  fs.readFile(carsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const cars = JSON.parse(data).cars;
    res.json(cars);
  });
});

// Get a specific car by ID
app.get('/api/cars/:id', (req, res) => {
  const carId = req.params.id;

  fs.readFile(carsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const cars = JSON.parse(data).cars;
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car);
  });
});

// Add a new car (POST request)
app.post('/api/cars', (req, res) => {
  const newCar = req.body;

  fs.readFile(carsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const cars = JSON.parse(data).cars;
    newCar.id = (cars.length + 1).toString();
    cars.push(newCar);

    fs.writeFile(carsFilePath, JSON.stringify({ cars }), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save car' });
      }
      res.status(201).json(newCar);
    });
  });
});

// Delete a car by ID (DELETE request)
app.delete('/api/cars/:id', (req, res) => {
  const carId = req.params.id;

  fs.readFile(carsFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const cars = JSON.parse(data).cars;
    const index = cars.findIndex(c => c.id === carId);

    if (index === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const deletedCar = cars.splice(index, 1)[0];

    fs.writeFile(carsFilePath, JSON.stringify({ cars }), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete car' });
      }
      res.json(deletedCar);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
