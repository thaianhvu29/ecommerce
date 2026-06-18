import { useState, useCallback } from 'react';

/**
 * Custom Hook: useToggle
 * Simple boolean state toggle
 * Demonstrates: useCallback for optimization
 */
const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);

    // useCallback ensures toggle function reference stays same
    const toggle = useCallback(() => {
        setValue(v => !v);
    }, []);

    return [value, toggle, setValue];
};

export default useToggle;
