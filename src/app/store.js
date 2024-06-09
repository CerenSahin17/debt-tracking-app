import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import debtReducer from '../redux/debt/debtSlice';
import paymentReducer from '../redux/paymentPlan/paymentSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        debt: debtReducer,
        paymentPlan: paymentReducer
    }
});
export default store;
