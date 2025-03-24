import { StorageService } from './storageTypes';

const PREFIX = 'date-calculator-plus:';

export class LocalStorageService implements StorageService {
  constructor(private prefix = PREFIX) {}

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private getCollectionKey(collectionName: string): string {
    return this.getPrefixedKey(`collection:${collectionName}`);
  }

  // Basic CRUD operations
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const data = localStorage.getItem(prefixedKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      // Only clear items with our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Collection operations
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const collectionKey = this.getCollectionKey(collectionName);
    const collection = await this.getItem<T[]>(collectionKey);
    return collection || [];
  }

  async addToCollection<T extends { id: string }>(collectionName: string, item: T): Promise<T> {
    const collectionKey = this.getCollectionKey(collectionName);
    const collection = await this.getCollection<T>(collectionName);
    
    // Ensure we don't have duplicates
    const filteredCollection = collection.filter(existingItem => existingItem.id !== item.id);
    
    // Add the new item
    const updatedCollection = [...filteredCollection, item];
    await this.setItem(collectionKey, updatedCollection);
    
    return item;
  }

  async updateInCollection<T extends { id: string }>(
    collectionName: string, 
    id: string, 
    updates: Partial<T>
  ): Promise<T | null> {
    const collection = await this.getCollection<T>(collectionName);
    const index = collection.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Update the item
    const updatedItem = { ...collection[index], ...updates };
    collection[index] = updatedItem;
    
    // Save the updated collection
    const collectionKey = this.getCollectionKey(collectionName);
    await this.setItem(collectionKey, collection);
    
    return updatedItem;
  }

  async removeFromCollection(collectionName: string, id: string): Promise<boolean> {
    const collection = await this.getCollection(collectionName);
    const filteredCollection = collection.filter(item => item.id !== id);
    
    if (filteredCollection.length === collection.length) {
      return false; // Nothing was removed
    }
    
    // Save the updated collection
    const collectionKey = this.getCollectionKey(collectionName);
    await this.setItem(collectionKey, filteredCollection);
    
    return true;
  }

  async clearCollection(collectionName: string): Promise<void> {
    const collectionKey = this.getCollectionKey(collectionName);
    await this.setItem(collectionKey, []);
  }

  // Import/Export
  async exportData(): Promise<string> {
    const exportData: Record<string, any> = {};
    
    // Export all items with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          // Store without the prefix
          const shortKey = key.substring(this.prefix.length);
          try {
            exportData[shortKey] = JSON.parse(value);
          } catch {
            exportData[shortKey] = value;
          }
        }
      }
    }
    
    return JSON.stringify(exportData);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      for (const key in data) {
        const prefixedKey = this.getPrefixedKey(key);
        localStorage.setItem(prefixedKey, JSON.stringify(data[key]));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data: Invalid format');
    }
  }
} 