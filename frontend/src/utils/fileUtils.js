/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts file extension from filename
 * @param {string} filename - Name of the file
 * @returns {string} File extension in lowercase
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Checks if a file type is allowed
 * @param {string} fileType - MIME type of the file
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether the file type is allowed
 */
export const isFileTypeAllowed = (fileType, allowedTypes) => {
  return allowedTypes.includes(fileType);
};

/**
 * Gets the appropriate icon based on file extension
 * @param {string} extension - File extension
 * @returns {string} Icon name for the file type
 */
export const getFileIconByExtension = (extension) => {
  const ext = extension.toLowerCase();
  
  if (['pdf'].includes(ext)) {
    return 'file-pdf';
  } else if (['doc', 'docx'].includes(ext)) {
    return 'file-word';
  } else if (['ppt', 'pptx'].includes(ext)) {
    return 'file-powerpoint';
  } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'file-excel';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
    return 'file-image';
  } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
    return 'file-video';
  } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
    return 'file-audio';
  } else {
    return 'file-alt';
  }
};

/**
 * Converts file to a base64 string
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Promise resolving to base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
