import { FileHandler as IFileHandler, ValidationResult, ErrorCode } from '../types/index.js';

/**
 * FileHandler service for managing file operations
 * Handles file validation, reading, downloading, and cleanup
 */
export class FileHandler implements IFileHandler {
  private readonly VALID_PDF_MIME_TYPE = 'application/pdf';
  private readonly VALID_PDF_EXTENSION = '.pdf';
  
  private temporaryData: ArrayBuffer | null = null;

  /**
   * Validates if the provided file is a valid PDF
   * Requirements: 1.2, 1.3
   * 
   * @param file - The file to validate
   * @returns ValidationResult with isValid flag and optional error message
   */
  validateFile(file: File): ValidationResult {
    // Check if file exists
    if (!file) {
      return {
        isValid: false,
        error: 'Файл не выбран'
      };
    }

    // Check file size
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'Файл пустой'
      };
    }

    // Check MIME type
    if (file.type !== this.VALID_PDF_MIME_TYPE) {
      return {
        isValid: false,
        error: 'Неверный тип файла. Пожалуйста, выберите PDF файл'
      };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(this.VALID_PDF_EXTENSION)) {
      return {
        isValid: false,
        error: 'Неверное расширение файла. Требуется .pdf'
      };
    }

    // File is valid
    return {
      isValid: true,
      fileSize: file.size
    };
  }

  /**
   * Reads a file and returns its contents as ArrayBuffer
   * Requirements: 1.2
   * 
   * @param file - The file to read
   * @returns Promise resolving to ArrayBuffer containing file data
   */
  async readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          this.temporaryData = event.target.result;
          resolve(event.target.result);
        } else {
          reject(new Error('Не удалось прочитать файл'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Triggers download of the compressed PDF file
   * Requirements: 3.2
   * 
   * @param data - The file data as Blob
   * @param filename - The name for the downloaded file
   */
  downloadFile(data: Blob, filename: string): void {
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(data);

    // Create a temporary anchor element to trigger download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';

    // Add to DOM, click, and remove
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up the URL after a short delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Cleans up temporary data from memory
   * Requirements: 5.3
   */
  cleanup(): void {
    this.temporaryData = null;
  }
}
