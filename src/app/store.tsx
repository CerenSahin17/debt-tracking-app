import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice.tsx';
import debtReducer from '../redux/debt/debtSlice.tsx';
import paymentReducer from '../redux/paymentPlan/paymentSlice.tsx';

const store = configureStore({
    reducer: {
        auth: authReducer,
        debt: debtReducer,
        paymentPlan: paymentReducer
    }
});
export default store;
