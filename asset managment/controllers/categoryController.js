const Category = require('../models/categoryModel');
const Asset = require('../models/assetModel');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with that name already exists'
      });
    }
    next(error);
  }
};

// Update an existing category
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Handle duplicate category name error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with that name already exists'
      });
    }
    next(error);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category is in use
    const assetCount = await Asset.countDocuments({ category: req.params.id });
    
    if (assetCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: It is assigned to ${assetCount} assets`
      });
    }
    
    // Delete the category
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};