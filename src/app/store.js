import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import debtReducer from '../redux/debt/debtSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        debt: debtReducer
    }
});
export default store;
