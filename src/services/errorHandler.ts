import { ErrorInfo, ErrorCode } from '../types/index.js';

/**
 * ErrorHandler service for managing and mapping errors to user-friendly messages
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export class ErrorHandler {
  /**
   * Maps various error types to user-friendly ErrorInfo objects
   * 
   * @param error - The error to map
   * @param context - Optional context about where the error occurred
   * @returns ErrorInfo with appropriate code and message
   */
  mapToErrorInfo(error: Error | unknown, context?: string): ErrorInfo {
    // Log error for debugging
    if (context) {
      console.error(`Error in ${context}:`, error);
    } else {
      console.error('Error:', error);
    }

    // Handle Error objects
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Check for invalid file type errors
      if (message.includes('invalid') || message.includes('неверный тип')) {
        return {
          code: ErrorCode.INVALID_FILE_TYPE,
          message: 'Invalid file type. Please select a PDF file',
          details: error.message
        };
      }

      // Check for corrupted PDF errors
      if (
        message.includes('corrupted') ||
        message.includes('invalid pdf') ||
        message.includes('поврежден') ||
        message.includes('parse') ||
        message.includes('malformed')
      ) {
        return {
          code: ErrorCode.CORRUPTED_PDF,
          message: 'File is corrupted or has an unsupported format',
          details: error.message
        };
      }

      // Check for compression-specific errors
      if (
        message.includes('compression') ||
        message.includes('compress') ||
        message.includes('сжатие')
      ) {
        return {
          code: ErrorCode.COMPRESSION_FAILED,
          message: 'Failed to compress file. Try another PDF file',
          details: error.message
        };
      }

      // Default error for Error objects
      return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unknown error occurred. Try again',
        details: error.message
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error,
        details: error
      };
    }

    // Handle unknown error types
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: 'Произошла неизвестная ошибка. Попробуйте снова',
      details: String(error)
    };
  }

  /**
   * Creates an ErrorInfo object for invalid file type
   */
  createInvalidFileTypeError(): ErrorInfo {
    return {
      code: ErrorCode.INVALID_FILE_TYPE,
      message: 'Неверный тип файла. Пожалуйста, выберите PDF файл'
    };
  }

  /**
   * Creates an ErrorInfo object for corrupted PDF
   */
  createCorruptedPdfError(): ErrorInfo {
    return {
      code: ErrorCode.CORRUPTED_PDF,
      message: 'Файл поврежден или имеет неподдерживаемый формат'
    };
  }

  /**
   * Creates an ErrorInfo object for compression failure
   */
  createCompressionFailedError(): ErrorInfo {
    return {
      code: ErrorCode.COMPRESSION_FAILED,
      message: 'Не удалось сжать файл. Попробуйте другой PDF файл'
    };
  }
}
