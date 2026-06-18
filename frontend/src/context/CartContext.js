import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
    SET_CART: 'SET_CART',
    ADD_ITEM: 'ADD_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    CLEAR_CART: 'CLEAR_CART',
    SET_LOADING: 'SET_LOADING'
};

// Initial state
const initialState = {
    items: [],
    totalPrice: 0,
    loading: false
};

// Reducer - Complex state logic
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.SET_CART:
            return {
                ...state,
                items: action.payload.items,
                totalPrice: action.payload.totalPrice,
                loading: false
            };

        case CART_ACTIONS.ADD_ITEM:
            const existingItemIndex = state.items.findIndex(
                item => item.product._id === action.payload.product._id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += action.payload.quantity;
                return {
                    ...state,
                    items: updatedItems,
                    totalPrice: calculateTotal(updatedItems)
                };
            }

            const newItems = [...state.items, action.payload];
            return {
                ...state,
                items: newItems,
                totalPrice: calculateTotal(newItems)
            };

        case CART_ACTIONS.UPDATE_ITEM:
            const items = state.items.map(item =>
                item._id === action.payload.itemId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                ...state,
                items,
                totalPrice: calculateTotal(items)
            };

        case CART_ACTIONS.REMOVE_ITEM:
            const filteredItems = state.items.filter(
                item => item._id !== action.payload
            );
            return {
                ...state,
                items: filteredItems,
                totalPrice: calculateTotal(filteredItems)
            };

        case CART_ACTIONS.CLEAR_CART:
            return initialState;

        case CART_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        default:
            return state;
    }
};

// Helper function
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { token } = useAuth();

    // Load cart when authenticated
    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: CART_ACTIONS.SET_CART, payload: data });
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
        }
    };

    const value = {
        cart: state,
        dispatch,
        CART_ACTIONS,
        cartItemsCount: state.items.reduce((total, item) => total + item.quantity, 0),
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export default CartContext;
