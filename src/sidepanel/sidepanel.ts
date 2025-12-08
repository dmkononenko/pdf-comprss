import {
  UIController as IUIController,
  CompressionResult,
  ErrorInfo
} from '../types/index.js';
import { formatFileSize } from '../utils/formatters.js';

/**
 * UIController for managing the popup interface
 * Requirements: 1.1, 2.1, 2.2, 2.3, 3.1
 */
export class UIController implements IUIController {
  private fileInput: HTMLInputElement;
  private fileLabel: HTMLLabelElement;
  private progressSection: HTMLElement;
  private progressFill: HTMLElement;
  private progressStatus: HTMLElement;
  private resultsSection: HTMLElement;
  private originalSizeSpan: HTMLElement;
  private compressedSizeSpan: HTMLElement;
  private compressionRatioSpan: HTMLElement;
  private downloadBtn: HTMLButtonElement;
  private errorSection: HTMLElement;
  private errorText: HTMLElement;

  private downloadData: { file: Blob; filename: string } | null = null;

  constructor() {
    // Get all DOM elements
    this.fileInput = document.getElementById('file-input') as HTMLInputElement;
    this.fileLabel = document.querySelector('.file-label') as HTMLLabelElement;
    this.progressSection = document.getElementById('progress-section') as HTMLElement;
    this.progressFill = document.getElementById('progress-fill') as HTMLElement;
    this.progressStatus = document.getElementById('progress-status') as HTMLElement;
    this.resultsSection = document.getElementById('results-section') as HTMLElement;
    this.originalSizeSpan = document.getElementById('original-size') as HTMLElement;
    this.compressedSizeSpan = document.getElementById('compressed-size') as HTMLElement;
    this.compressionRatioSpan = document.getElementById('compression-ratio') as HTMLElement;
    this.downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    this.errorSection = document.getElementById('error-section') as HTMLElement;
    this.errorText = document.getElementById('error-text') as HTMLElement;

    // Set up download button listener
    this.downloadBtn.addEventListener('click', () => {
      if (this.downloadData) {
        this.triggerDownload(this.downloadData.file, this.downloadData.filename);
      }
    });
  }

  /**
   * Shows the file selector (already visible by default)
   */
  showFileSelector(): void {
    this.hideAllSections();
    // File selector is always visible, just hide other sections
  }

  /**
   * Displays progress bar and status message
   * 
   * @param progress - Progress percentage (0-100)
   * @param status - Status message to display
   */
  displayProgress(progress: number, status: string): void {
    this.hideAllSections();
    this.progressSection.classList.remove('hidden');
    
    // Update progress bar
    this.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    
    // Update status text
    this.progressStatus.textContent = status;
  }

  /**
   * Displays compression results
   * 
   * @param result - Compression result with sizes and ratio
   */
  displayResults(result: CompressionResult): void {
    this.hideAllSections();
    this.resultsSection.classList.remove('hidden');
    
    // Display file sizes
    this.originalSizeSpan.textContent = formatFileSize(result.originalSize);
    this.compressedSizeSpan.textContent = formatFileSize(result.compressedSize);
    
    // Display compression ratio
    this.compressionRatioSpan.textContent = `${result.compressionRatio.toFixed(2)}%`;
  }

  /**
   * Shows error message
   * 
   * @param error - Error information to display
   */
  showError(error: ErrorInfo): void {
    this.hideAllSections();
    this.errorSection.classList.remove('hidden');
    this.errorText.textContent = error.message;
  }

  /**
   * Enables download button with file data
   * 
   * @param file - Blob containing the compressed PDF
   * @param filename - Name for the downloaded file
   */
  enableDownload(file: Blob, filename: string): void {
    this.downloadData = { file, filename };
    this.downloadBtn.disabled = false;
  }

  /**
   * Triggers file download
   * 
   * @param file - Blob to download
   * @param filename - Name for the downloaded file
   */
  private triggerDownload(file: Blob, filename: string): void {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Hides all sections except file selector
   */
  private hideAllSections(): void {
    this.progressSection.classList.add('hidden');
    this.resultsSection.classList.add('hidden');
    this.errorSection.classList.add('hidden');
  }

  /**
   * Gets the file input element for event listener attachment
   */
  getFileInput(): HTMLInputElement {
    return this.fileInput;
  }

  /**
   * Resets the UI to initial state
   */
  reset(): void {
    this.hideAllSections();
    this.fileInput.value = '';
    this.downloadData = null;
    this.downloadBtn.disabled = true;
  }
}

/**
 * Main Application Orchestrator
 * Integrates all components and manages the application flow
 * Requirements: 1.2, 1.3, 1.4, 2.2, 2.3, 3.2, 5.1, 5.3
 */
class Application {
  private uiController: UIController;
  private fileHandler: any; // Will be imported
  private compressionEngine: any; // Will be imported
  private errorHandler: any; // Will be imported
  private stateManager: any; // Will be imported

  constructor() {
    // Initialize UI controller
    this.uiController = new UIController();

    // Initialize services (will be imported)
    this.initializeServices();

    // Set up event listeners
    this.setupEventListeners();

    // Set up cleanup on window close
    this.setupCleanup();
  }

  private async initializeServices(): Promise<void> {
    // Dynamic imports to load services
    const { FileHandler } = await import('../services/fileHandler.js');
    const { CompressionEngine } = await import('../services/compressionEngine.js');
    const { ErrorHandler } = await import('../services/errorHandler.js');
    const { AppStateManager } = await import('../services/stateManager.js');

    this.fileHandler = new FileHandler();
    this.compressionEngine = new CompressionEngine();
    this.errorHandler = new ErrorHandler();
    this.stateManager = new AppStateManager();

    // Subscribe to state changes
    this.stateManager.subscribe((state: any) => {
      this.handleStateChange(state);
    });
  }

  private setupEventListeners(): void {
    // File selection handler
    const fileInput = this.uiController.getFileInput();
    fileInput.addEventListener('change', (event) => {
      this.handleFileSelection(event);
    });
  }

  private setupCleanup(): void {
    // Clean up when extension is closed
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Handles file selection event
   */
  private async handleFileSelection(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      // Update state to validating
      this.stateManager.setState({
        currentState: 'validating' as any,
        selectedFile: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      });

      // Show progress
      this.uiController.displayProgress(10, 'Проверка файла...');

      // Validate file
      const validationResult = this.fileHandler.validateFile(file);

      if (!validationResult.isValid) {
        const errorInfo = this.errorHandler.createInvalidFileTypeError();
        errorInfo.message = validationResult.error || errorInfo.message;
        this.stateManager.setState({
          currentState: 'error' as any,
          error: errorInfo
        });
        this.uiController.showError(errorInfo);
        return;
      }

      // File is valid, start compression
      await this.compressFile(file);

    } catch (error) {
      const errorInfo = this.errorHandler.mapToErrorInfo(error, 'file selection');
      this.stateManager.setState({
        currentState: 'error' as any,
        error: errorInfo
      });
      this.uiController.showError(errorInfo);
    }
  }

  /**
   * Compresses the selected PDF file
   */
  private async compressFile(file: File): Promise<void> {
    try {
      // Update state to loading
      this.stateManager.setState({
        currentState: 'loading' as any
      });
      this.uiController.displayProgress(30, 'Загрузка файла...');

      // Read file
      const fileData = await this.fileHandler.readFile(file);

      // Update state to compressing
      this.stateManager.setState({
        currentState: 'compressing' as any,
        progress: 50
      });
      this.uiController.displayProgress(50, 'Сжатие PDF...');

      // Compress PDF
      const compressionResult = await this.compressionEngine.compressPDF(fileData, {
        imageQuality: 70,
        imageScale: 1.0,
        removeMetadata: true,
        optimizeStructure: true
      });

      if (!compressionResult.success) {
        throw new Error(compressionResult.error || 'Compression failed');
      }

      // Update state to completed
      this.stateManager.setState({
        currentState: 'completed' as any,
        compressionResult,
        progress: 100
      });

      // Show results
      this.uiController.displayResults(compressionResult);

      // Enable download
      const compressedBlob = new Blob([compressionResult.compressedData], {
        type: 'application/pdf'
      });
      
      const { addCompressedSuffix } = await import('../utils/formatters.js');
      const downloadFilename = addCompressedSuffix(file.name);
      
      this.uiController.enableDownload(compressedBlob, downloadFilename);

    } catch (error) {
      const errorInfo = this.errorHandler.mapToErrorInfo(error, 'compression');
      this.stateManager.setState({
        currentState: 'error' as any,
        error: errorInfo
      });
      this.uiController.showError(errorInfo);
    }
  }

  /**
   * Handles state changes
   */
  private handleStateChange(state: any): void {
    // Update UI based on state changes
    // This is called automatically when state changes
  }

  /**
   * Cleans up resources
   */
  private cleanup(): void {
    if (this.fileHandler) {
      this.fileHandler.cleanup();
    }
    if (this.stateManager) {
      this.stateManager.reset();
    }
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Application();
  });
} else {
  new Application();
}
