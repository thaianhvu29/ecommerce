import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Sync state with localStorage
 * Demonstrates: State persistence, useEffect cleanup
 */
const useLocalStorage = (key, initialValue) => {
    // Get from localStorage or use initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;
