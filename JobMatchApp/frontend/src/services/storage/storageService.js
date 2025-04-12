import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Async Storage service for persisting data locally
 */
const storageService = {
  /**
   * Store string value
   * @param {string} key - Storage key
   * @param {string} value - String value to store
   * @returns {Promise<void>}
   */
  storeString: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage Error (storeString):', error);
      throw error;
    }
  },
  
  /**
   * Store object value (JSON)
   * @param {string} key - Storage key
   * @param {Object} value - Object to store
   * @returns {Promise<void>}
   */
  storeObject: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('AsyncStorage Error (storeObject):', error);
      throw error;
    }
  },
  
  /**
   * Get string value
   * @param {string} key - Storage key
   * @returns {Promise<string|null>} Stored string or null if not found
   */
  getString: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage Error (getString):', error);
      throw error;
    }
  },
  
  /**
   * Get object value
   * @param {string} key - Storage key
   * @returns {Promise<Object|null>} Stored object or null if not found
   */
  getObject: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('AsyncStorage Error (getObject):', error);
      throw error;
    }
  },
  
  /**
   * Remove item
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage Error (removeItem):', error);
      throw error;
    }
  },
  
  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage Error (clearAll):', error);
      throw error;
    }
  },
  
  /**
   * Get all keys
   * @returns {Promise<string[]>} Array of storage keys
   */
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('AsyncStorage Error (getAllKeys):', error);
      throw error;
    }
  },
  
  /**
   * Get multiple items by keys
   * @param {string[]} keys - Array of storage keys
   * @returns {Promise<Array>} Array of key-value pairs
   */
  multiGet: async (keys) => {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('AsyncStorage Error (multiGet):', error);
      throw error;
    }
  },
  
  /**
   * Remove multiple items by keys
   * @param {string[]} keys - Array of storage keys
   * @returns {Promise<void>}
   */
  multiRemove: async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('AsyncStorage Error (multiRemove):', error);
      throw error;
    }
  }
};

export default storageService;