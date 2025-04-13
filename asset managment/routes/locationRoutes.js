// routes/locationRoutes.js

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Routes
router.get('/', locationController.getAllLocations);         // Get all locations
router.get('/:id', locationController.getLocationById);      // Get a single location by ID
router.post('/', locationController.createLocation);         // Create a new location
router.put('/:id', locationController.updateLocation);       // Update an existing location
router.delete('/:id', locationController.deleteLocation);    // Delete a location

module.exports = router;
