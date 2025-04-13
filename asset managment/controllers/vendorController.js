const Vendor = require('../models/vendorModel');
const Asset = require('../models/assetModel');

// Get all vendors
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
};

// Get single vendor
exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// Create new vendor
exports.createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// Update vendor
exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// Delete vendor
exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    
    // Check if any assets use this vendor
    const Asset = require('../models/assetModel');
    const assetCount = await Asset.countDocuments({ vendor: req.params.id });
    
    if (assetCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete vendor: ${assetCount} assets are associated with this vendor`
      });
    }
    
    await vendor.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Get vendor assets
exports.getVendorAssets = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    
    const Asset = require('../models/assetModel');
    const assets = await Asset.find({ vendor: req.params.id })
      .populate('category', 'name')
      .populate('location', 'name');
    
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};