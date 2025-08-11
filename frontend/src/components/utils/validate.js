export function validateFile(file) {

    const allowedTypes = ["image/png", "image/jpeg"]
    const maxSizeMB = 10
    const minSizeKB = 10

    if (!file) {
      return "No file selected.";
    }
  
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return "Photo must be a PNG or JPEG image.";
    }
  
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File is too large. Max size is ${maxSizeMB} MB.`;
    }
  
    if (minSizeKB && file.size < minSizeKB * 1024) {
      return `File is too small. Min size is ${minSizeKB} KB.`;
    }
  
    return true; // valid
  }