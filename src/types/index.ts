// Type definitions for PDF Compressor Extension

export interface UIController {
  showFileSelector(): void;
  displayProgress(progress: number, status: string): void;
  displayResults(result: CompressionResult): void;
  showError(error: ErrorInfo): void;
  enableDownload(file: Blob, filename: string): void;
}

export interface FileHandler {
  validateFile(file: File): ValidationResult;
  readFile(file: File): Promise<ArrayBuffer>;
  downloadFile(data: Blob, filename: string): void;
  cleanup(): void;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  fileSize?: number;
}

export interface CompressionEngine {
  compressPDF(pdfData: ArrayBuffer, options: CompressionOptions): Promise<CompressionResult>;
}

export interface CompressionOptions {
  imageQuality: number; // 0-100, JPEG quality for compressed images
  imageScale: number; // 0.1-2.0, scale factor for rendering (< 1.0 reduces resolution)
  removeMetadata: boolean;
  optimizeStructure: boolean;
}

export interface CompressionResult {
  compressedData: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  success: boolean;
  error?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export enum CompressionState {
  IDLE = 'idle',
  VALIDATING = 'validating',
  LOADING = 'loading',
  COMPRESSING = 'compressing',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export interface AppState {
  currentState: CompressionState;
  selectedFile: FileInfo | null;
  compressionResult: CompressionResult | null;
  error: ErrorInfo | null;
  progress: number;
}

export interface ErrorInfo {
  code: ErrorCode;
  message: string;
  details?: string;
}

export enum ErrorCode {
  INVALID_FILE_TYPE = 'invalid_file_type',
  CORRUPTED_PDF = 'corrupted_pdf',
  COMPRESSION_FAILED = 'compression_failed',
  UNKNOWN_ERROR = 'unknown_error'
}
