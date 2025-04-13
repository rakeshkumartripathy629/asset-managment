/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
exports.formatDate = (date) => {
    if (!date) return null;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    return d.toISOString().split('T')[0];
  };
  
  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency symbol
   * @returns {string} - Formatted currency string
   */
  exports.formatCurrency = (amount, currency = '$') => {
    if (amount === null || amount === undefined) return '';
    
    return `${currency}${parseFloat(amount).toFixed(2)}`;
  };