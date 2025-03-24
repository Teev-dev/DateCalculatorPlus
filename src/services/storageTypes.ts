export interface Calculation {
  id: string;
  type: 'diff' | 'add' | 'workday' | 'timezone';
  label?: string;
  createdAt: string;
  parameters: Record<string, any>;
  result: any;
  isFavorite?: boolean;
}

export interface StorageService {
  // Basic CRUD operations
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Collection operations
  getCollection<T>(collectionName: string): Promise<T[]>;
  addToCollection<T extends { id: string }>(collectionName: string, item: T): Promise<T>;
  updateInCollection<T extends { id: string }>(collectionName: string, id: string, updates: Partial<T>): Promise<T | null>;
  removeFromCollection(collectionName: string, id: string): Promise<boolean>;
  clearCollection(collectionName: string): Promise<void>;
  
  // Import/Export
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<void>;
} 