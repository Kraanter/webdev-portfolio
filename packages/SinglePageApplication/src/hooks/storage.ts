import { useState } from 'react';

export type Storage = 'local' | 'session';

export const useStorage = <T>(key: string, initialValue: T, storage: Storage): [T, (value: T) => void, () => void] => {
  const storageObject = storage === 'local' ? localStorage : sessionStorage;

  function getLocalStorageValue() {
    try {
      const item = storageObject.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }

  const [storedValue, setStoredValue] = useState(getLocalStorageValue());

  const saveStoredValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      storageObject.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  const removeStoredValue = () => {
    try {
      storageObject.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, saveStoredValue, removeStoredValue];
};

export interface UserData {
  id: string;
  name: string;
}

export const useUser = () => useStorage<UserData | undefined>('user', undefined, 'local');