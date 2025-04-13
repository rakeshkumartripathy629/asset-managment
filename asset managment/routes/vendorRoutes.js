const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');

// Protected routes
router.post('/',vendorController.createVendor);
router.put('/:id', protect, vendorController.updateVendor);
router.delete('/:id', protect, vendorController.deleteVendor);

// Public routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.get('/:id/assets', vendorController.getVendorAssets);

module.exports = router;
