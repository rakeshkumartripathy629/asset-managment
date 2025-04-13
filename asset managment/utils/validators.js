/**
 * Validate asset data
 * @param {Object} data - Asset data to validate
 * @returns {Object} - Result with validation status and errors
 */
exports.validateAsset = (data) => {
    const errors = [];
    
    // Required fields validation
    if (!data.name || data.name.trim() === '') {
      errors.push('Asset name is required');
    }
    
    if (!data.asset_tag || data.asset_tag.trim() === '') {
      errors.push('Asset tag is required');
    }
    
    // Date validation
    if (data.purchase_date && isNaN(new Date(data.purchase_date).getTime())) {
      errors.push('Invalid purchase date format');
    }
    
    if (data.warranty_expiry && isNaN(new Date(data.warranty_expiry).getTime())) {
      errors.push('Invalid warranty expiry date format');
    }
    
    // Cost validation
    if (data.purchase_cost && isNaN(parseFloat(data.purchase_cost))) {
      errors.push('Purchase cost must be a number');
    }
    
    // Status validation
    const validStatuses = ['available', 'assigned', 'maintenance', 'retired'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };