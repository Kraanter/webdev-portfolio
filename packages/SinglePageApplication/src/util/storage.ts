export type Storage = 'local' | 'session';

export const useStorage = <T>(
  key: string,
  initialValue: T,
  storage: Storage
): [() => T, (value: T) => void, () => void] => {
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

  const saveStoredValue = (value: any) => {
    console.log('saveStoredValue', value);
    try {
      const valueToStore = value instanceof Function ? value(getLocalStorageValue()) : value;
      storageObject.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const removeStoredValue = () => {
    try {
      storageObject.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return [getLocalStorageValue, saveStoredValue, removeStoredValue];
};
