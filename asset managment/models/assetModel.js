// models/assetModel.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assetTag: {
    type: String,
    required: [true, 'Asset tag is required'],
    unique: true,
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Retired', 'Lost'],
    default: 'Active'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  documentUrl: {
    type: String
  },
  warranty: {
    expirationDate: {
      type: Date
    },
    details: {
      type: String
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;

