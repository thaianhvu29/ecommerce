import React, { createContext, useReducer, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    UPDATE_USER: 'UPDATE_USER'
};

// Reducer function - Quan trọng: Pattern để quản lý complex state
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };

        default:
            return state;
    }
};

// Context Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from token on mount
    useEffect(() => {
        const loadUser = async () => {
            if (state.token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${state.token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        dispatch({
                            type: AUTH_ACTIONS.LOGIN_SUCCESS,
                            payload: { user: userData, token: state.token }
                        });
                    } else {
                        dispatch({ type: AUTH_ACTIONS.LOGOUT });
                    }
                } catch (error) {
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                }
            } else {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        loadUser();
    }, []); // Only run once on mount

    // Context value - memoized để optimize performance
    const value = {
        user: state.user,
        token: state.token,
        loading: state.loading,
        error: state.error,
        dispatch,
        AUTH_ACTIONS,
        isAuthenticated: !!state.user,
        isAdmin: state.user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng Auth Context - Best Practice
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
