import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook: useFetch
 * Reusable hook for API calls with loading, error states
 * Demonstrates: Custom Hooks, useCallback, useEffect dependencies
 */
const useFetch = (fetchFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback để memoize function, tránh re-create mỗi render
    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchFunction();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
};

export default useFetch;
