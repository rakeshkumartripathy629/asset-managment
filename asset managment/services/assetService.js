const Asset = require('../models/assetModel');

exports.assetService = {
  /**
   * Generate a unique asset tag
   * @returns {Promise<string>} - Unique asset tag
   */
  generateAssetTag: async () => {
    // Format: AT-YYYYMMDD-XXXX (where XXXX is sequential)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    
    // Find the latest asset with the similar date format
    const latestAsset = await Asset.findOne({
      asset_tag: new RegExp(`AT-${datePart}-\\d{4}`)
    }).sort({ asset_tag: -1 });
    
    let sequentialNumber = 1;
    
    if (latestAsset && latestAsset.asset_tag) {
      // Extract the sequential part and increment it
      const parts = latestAsset.asset_tag.split('-');
      if (parts.length === 3) {
        sequentialNumber = parseInt(parts[2]) + 1;
      }
    }
    
    // Format the sequential number with leading zeros
    const sequentialPart = String(sequentialNumber).padStart(4, '0');
    
    return `AT-${datePart}-${sequentialPart}`;
  },
  
  /**
   * Calculate assets value and statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} - Statistics object
   */
  getAssetStatistics: async (filters = {}) => {
    try {
      // Base query
      const query = { ...filters };
      
      // Get all assets matching the query
      const assets = await Asset.find(query);
      
      // Calculate statistics
      const totalAssets = assets.length;
      let totalValue = 0;
      
      const statusCounts = {
        available: 0,
        assigned: 0,
        maintenance: 0,
        retired: 0
      };
      
      // Calculate totals
      assets.forEach(asset => {
        // Add to total value if purchase cost exists
        if (asset.purchase_cost) {
          totalValue += asset.purchase_cost;
        }
        
        // Count by status
        if (asset.status && statusCounts.hasOwnProperty(asset.status)) {
          statusCounts[asset.status]++;
        }
      });
      
      // Calculate assets with warranty
      const now = new Date();
      const assetsInWarranty = assets.filter(asset => {
        return asset.warranty_expiry && new Date(asset.warranty_expiry) > now;
      }).length;
      
      return {
        totalAssets,
        totalValue,
        statusCounts,
        assetsInWarranty
      };
    } catch (error) {
      console.error('Error calculating asset statistics:', error);
      throw error;
    }
  }
};