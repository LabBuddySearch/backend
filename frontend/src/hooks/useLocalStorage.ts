import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, defaultValue?: string) => {
  const [value, setValue] = useState<string | null>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ?? defaultValue ?? null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const newValue = localStorage.getItem(key);
        setValue(newValue ?? defaultValue ?? null);
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleStorageChange as EventListener);
    };
  }, [key, defaultValue]);

  return value;
};

export const setLocalStorageWithEvent = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event('localStorageUpdated'));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};