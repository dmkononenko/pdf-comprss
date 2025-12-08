import { AppState, CompressionState } from '../types/index.js';

/**
 * AppStateManager for managing application state and notifying listeners
 * Requirements: 2.2
 */
export class AppStateManager {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.state = {
      currentState: CompressionState.IDLE,
      selectedFile: null,
      compressionResult: null,
      error: null,
      progress: 0
    };
  }

  /**
   * Updates the application state with partial updates
   * 
   * @param updates - Partial state updates to apply
   */
  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Gets the current application state
   * 
   * @returns A copy of the current state
   */
  getState(): AppState {
    return { ...this.state };
  }

  /**
   * Subscribes a listener to state changes
   * 
   * @param listener - Callback function to be called on state changes
   * @returns Unsubscribe function
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifies all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Resets the state to initial values
   */
  reset(): void {
    this.state = {
      currentState: CompressionState.IDLE,
      selectedFile: null,
      compressionResult: null,
      error: null,
      progress: 0
    };
    this.notifyListeners();
  }
}
