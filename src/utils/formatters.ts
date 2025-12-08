/**
 * Formats a file size in bytes to a human-readable format
 * @param bytes - The file size in bytes
 * @returns Formatted string with appropriate unit (B, KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  // Handle edge case: 0 bytes
  if (bytes === 0) {
    return '0 B';
  }

  // Handle negative numbers
  if (bytes < 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  
  // Calculate the appropriate unit index
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Clamp to available units (max GB)
  const unitIndex = Math.min(i, units.length - 1);
  
  // Calculate the value in the appropriate unit
  const value = bytes / Math.pow(k, unitIndex);
  
  // Format with 2 decimal places, but remove trailing zeros
  const formatted = value.toFixed(2).replace(/\.?0+$/, '');
  
  return `${formatted} ${units[unitIndex]}`;
}

/**
 * Adds "_compressed" suffix to a filename before the file extension
 * @param filename - The original filename
 * @returns Filename with "_compressed" suffix added before extension
 */
export function addCompressedSuffix(filename: string): string {
  // Handle empty string
  if (!filename || filename.trim() === '') {
    return '_compressed';
  }

  // Find the last dot in the filename
  const lastDotIndex = filename.lastIndexOf('.');
  
  // If no extension found or dot is at the start (hidden file)
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return `${filename}_compressed`;
  }
  
  // Split filename into base and extension
  const baseName = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);
  
  return `${baseName}_compressed${extension}`;
}

/**
 * Calculates the compression ratio as a percentage
 * @param originalSize - The original file size in bytes
 * @param compressedSize - The compressed file size in bytes
 * @returns Compression ratio as a percentage (0-100)
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  // Handle edge cases
  if (originalSize <= 0) {
    return 0;
  }
  
  if (compressedSize < 0) {
    return 0;
  }
  
  // If compressed size is greater than or equal to original, no compression
  if (compressedSize >= originalSize) {
    return 0;
  }
  
  // Calculate compression ratio: ((original - compressed) / original) * 100
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;
  
  // Round to 2 decimal places
  return Math.round(ratio * 100) / 100;
}
