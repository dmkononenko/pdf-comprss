import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import {
  CompressionEngine as ICompressionEngine,
  CompressionOptions,
  CompressionResult
} from '../types/index.js';

// Configure pdf.js worker
// In production (Chrome extension), the worker is copied to the dist folder
// In development, we use the node_modules path
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.mjs');
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
}

/**
 * CompressionEngine service for compressing PDF files
 * Uses pdf.js for page extraction, Canvas API for image compression, and pdf-lib for PDF creation
 * Requirements: 4.1, 4.2, 4.3
 */
export class CompressionEngine implements ICompressionEngine {
  /**
   * Compresses a PDF file by rendering pages to Canvas, compressing as JPEG, and rebuilding PDF
   * 
   * @param pdfData - The PDF file data as ArrayBuffer
   * @param options - Compression options (image quality, scale, metadata removal, structure optimization)
   * @returns Promise resolving to CompressionResult with compressed data and statistics
   */
  async compressPDF(
    pdfData: ArrayBuffer,
    options: CompressionOptions
  ): Promise<CompressionResult> {
    const originalSize = pdfData.byteLength;

    try {
      // 1. Load PDF with pdf.js
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDocument = await loadingTask.promise;

      // 2. Create new PDF document with pdf-lib
      const newPdfDoc = await PDFDocument.create();

      // 3. Process each page
      const numPages = pdfDocument.numPages;
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        // 3.1 Get page from pdf.js
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: options.imageScale });

        // 3.2 Render page to Canvas
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // 3.3 Compress image through Canvas API
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob from canvas'));
              }
            },
            'image/jpeg',
            options.imageQuality / 100
          );
        });

        const imageBytes = new Uint8Array(await blob.arrayBuffer());

        // 3.4 Embed compressed image into new PDF
        const image = await newPdfDoc.embedJpg(imageBytes);
        const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height
        });

        // 3.5 Cleanup Canvas
        canvas.remove();
      }

      // 4. Remove metadata if requested
      if (options.removeMetadata) {
        this.removeMetadata(newPdfDoc);
      }

      // 5. Save with optimization
      const compressedData = await newPdfDoc.save({
        useObjectStreams: options.optimizeStructure,
        addDefaultPage: false
      });

      const compressedSize = compressedData.byteLength;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      return {
        compressedData,
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, compressionRatio),
        success: true
      };
    } catch (error) {
      console.error('Compression error:', error);

      return {
        compressedData: new Uint8Array(0),
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown compression error'
      };
    }
  }

  /**
   * Removes metadata from the PDF document
   * 
   * @param pdfDoc - The PDF document to modify
   */
  private removeMetadata(pdfDoc: PDFDocument): void {
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
    } catch (error) {
      console.warn('Could not remove all metadata:', error);
    }
  }
}
