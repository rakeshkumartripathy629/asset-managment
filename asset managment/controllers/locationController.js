const Location = require('../models/locationModel');
const Asset = require('../models/assetModel');

// Get all locations
exports.getAllLocations = async (req, res, next) => {
  try {
    const locations = await Location.find().sort('name');
    
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

// Get a single location by ID
exports.getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// Create a new location
exports.createLocation = async (req, res, next) => {
  try {
    const location = await Location.create(req.body);
    
    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing location
exports.updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

// Delete a location
exports.deleteLocation = async (req, res, next) => {
  try {
    // Check if location exists
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    // Check if location is in use
    const assetCount = await Asset.countDocuments({ location: req.params.id });
    
    if (assetCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete location: It is assigned to ${assetCount} assets`
      });
    }
    
    // Delete the location
    await Location.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};