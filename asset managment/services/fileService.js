const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs functions to promise-based
const unlinkAsync = util.promisify(fs.unlink);

// File handling service
exports.fileService = {
  /**
   * Delete a file from the filesystem
   * @param {string} filePath - Path to the file
   * @returns {Promise<boolean>} - Success status
   */
  deleteFile: async (filePath) => {
    try {
      // Make sure we have a valid file path
      if (!filePath) return false;
      
      // Get the absolute path
      const absolutePath = path.resolve(filePath);
      
      // Check if file exists
      if (fs.existsSync(absolutePath)) {
        await unlinkAsync(absolutePath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },
  
  /**
   * Get file type based on extension
   * @param {string} filePath - Path to the file
   * @returns {string} - File type (image, document, other)
   */
  getFileType: (filePath) => {
    if (!filePath) return 'unknown';
    
    const extension = path.extname(filePath).toLowerCase();
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'];
    
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (documentExtensions.includes(extension)) {
      return 'document';
    } else {
      return 'other';
    }
  }
};