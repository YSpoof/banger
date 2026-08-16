export class StorageService {
  addItem = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  getItem = <T>(key: string): T | null => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch (error) {
      return null;
    }
  };

  removeItem = (key: string) => {
    localStorage.removeItem(key);
  };
}

export const storageService = new StorageService();
