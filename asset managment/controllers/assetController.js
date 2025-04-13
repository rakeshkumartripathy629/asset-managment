// controllers/assetController.js
const Asset = require('../models/assetModel');
const fs = require('fs');
const path = require('path');

// Get all assets
exports.getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find()
      .populate('category', 'name')
      .populate('location', 'name')
      .populate('vendor', 'name');
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};

// Get single asset
exports.getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('category', 'name description')
      .populate('location', 'name address')
      .populate('vendor', 'name contactPerson email phone');
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// Create new asset
exports.createAsset = async (req, res, next) => {
  try {
    // The file paths are already added to req.body by the middleware
    const assetData = req.body;
    
    const asset = await Asset.create(assetData);
    
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    // Delete uploaded files if asset creation fails
    if (req.body.imageUrl) {
      fs.unlink(req.body.imageUrl, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }
    if (req.body.documentUrl) {
      fs.unlink(req.body.documentUrl, (err) => {
        if (err) console.error('Error deleting document:', err);
      });
    }
    next(error);
  }
};

// Update asset
exports.updateAsset = async (req, res, next) => {
  try {
    let asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    
    // Process any uploaded files
    const updates = req.body;
    
    // If a new image was uploaded, delete the old one
    if (updates.imageUrl && asset.imageUrl && asset.imageUrl !== updates.imageUrl) {
      fs.unlink(asset.imageUrl, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }
    
    // If a new document was uploaded, delete the old one
    if (updates.documentUrl && asset.documentUrl && asset.documentUrl !== updates.documentUrl) {
      fs.unlink(asset.documentUrl, (err) => {
        if (err) console.error('Error deleting old document:', err);
      });
    }
    
    asset = await Asset.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

// Delete asset
exports.deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    
    // Delete associated files
    if (asset.imageUrl) {
      fs.unlink(asset.imageUrl, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }
    if (asset.documentUrl) {
      fs.unlink(asset.documentUrl, (err) => {
        if (err) console.error('Error deleting document:', err);
      });
    }
    
    await asset.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Search assets
exports.searchAssets = async (req, res, next) => {
  try {
    const { query, category, location, status } = req.query;
    
    const searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { assetTag: { $regex: query, $options: 'i' } },
        { serialNumber: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) searchQuery.category = category;
    if (location) searchQuery.location = location;
    if (status) searchQuery.status = status;
    
    const assets = await Asset.find(searchQuery)
      .populate('category', 'name')
      .populate('location', 'name')
      .populate('vendor', 'name');
    
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};