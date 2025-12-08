/**
 * Background Service Worker for PDF Compressor Extension
 * Handles opening the side panel when extension icon is clicked
 */

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});
